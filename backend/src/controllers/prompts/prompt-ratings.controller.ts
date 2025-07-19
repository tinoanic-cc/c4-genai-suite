import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { LocalAuthGuard } from '../../domain/auth';
import { PromptRatingEntity, UserEntity } from '../../domain/database';
import { CreatePromptRatingDto, PromptRatingResponseDto, UpdatePromptRatingDto } from '../../domain/prompts/dtos';
import { PromptRatingsService } from '../../domain/prompts/prompt-ratings.service';

@ApiTags('prompt-ratings')
@UseGuards(LocalAuthGuard)
@Controller('prompts/:promptId/ratings')
export class PromptRatingsController {
  constructor(private readonly promptRatingsService: PromptRatingsService) {}

  private transformToPromptRatingResponseDto(rating: PromptRatingEntity & { user?: UserEntity }): PromptRatingResponseDto {
    return {
      id: rating.id,
      rating: rating.rating,
      comment: rating.comment,
      createdAt: rating.createdAt.toISOString(),
      author: rating.user
        ? {
            id: parseInt(rating.user.id.toString(), 10),
            name: rating.user.name,
          }
        : undefined,
    };
  }

  @Post()
  @ApiOperation({ summary: 'Rate a prompt' })
  @ApiResponse({ status: 201, description: 'Rating created successfully', type: PromptRatingResponseDto })
  @ApiResponse({ status: 400, description: 'User has already rated this prompt' })
  @ApiResponse({ status: 404, description: 'Prompt not found' })
  async create(
    @Param('promptId', ParseIntPipe) promptId: number,
    @Req() req: Request,
    @Body() createPromptRatingDto: CreatePromptRatingDto,
  ): Promise<PromptRatingResponseDto> {
    const user = req.user as UserEntity;
    const rating = await this.promptRatingsService.create(promptId, user.id, createPromptRatingDto);
    return this.transformToPromptRatingResponseDto(rating);
  }

  @Get()
  @ApiOperation({ summary: 'Get all ratings for a prompt' })
  @ApiResponse({ status: 200, description: 'List of ratings', type: [PromptRatingResponseDto] })
  async findByPrompt(@Param('promptId', ParseIntPipe) promptId: number): Promise<PromptRatingResponseDto[]> {
    const ratings = await this.promptRatingsService.findByPrompt(promptId);
    return ratings.map((rating) => this.transformToPromptRatingResponseDto(rating));
  }

  @Get('my')
  @ApiOperation({ summary: 'Get current user rating for a prompt' })
  @ApiResponse({ status: 200, description: 'User rating', type: PromptRatingResponseDto })
  @ApiResponse({ status: 404, description: 'Rating not found' })
  async findMyRating(@Param('promptId', ParseIntPipe) promptId: number, @Req() req: Request): Promise<PromptRatingResponseDto> {
    const user = req.user as UserEntity;
    const rating = await this.promptRatingsService.findUserRating(promptId, user.id);
    if (!rating) {
      throw new NotFoundException('Rating not found');
    }
    return this.transformToPromptRatingResponseDto(rating);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get rating statistics for a prompt' })
  @ApiResponse({
    status: 200,
    description: 'Rating statistics',
    schema: {
      type: 'object',
      properties: {
        averageRating: { type: 'number', example: 4.2 },
        totalRatings: { type: 'number', example: 15 },
        ratingDistribution: {
          type: 'object',
          properties: {
            '1': { type: 'number', example: 1 },
            '2': { type: 'number', example: 2 },
            '3': { type: 'number', example: 3 },
            '4': { type: 'number', example: 4 },
            '5': { type: 'number', example: 5 },
          },
        },
      },
    },
  })
  async getStats(@Param('promptId', ParseIntPipe) promptId: number) {
    return this.promptRatingsService.getPromptRatingStats(promptId);
  }

  @Put()
  @ApiOperation({ summary: 'Update user rating for a prompt' })
  @ApiResponse({ status: 200, description: 'Rating updated successfully', type: PromptRatingResponseDto })
  @ApiResponse({ status: 404, description: 'Rating not found' })
  async update(
    @Param('promptId', ParseIntPipe) promptId: number,
    @Req() req: Request,
    @Body() updatePromptRatingDto: UpdatePromptRatingDto,
  ): Promise<PromptRatingResponseDto> {
    const user = req.user as UserEntity;
    const rating = await this.promptRatingsService.update(promptId, user.id, updatePromptRatingDto);
    return this.transformToPromptRatingResponseDto(rating);
  }

  @Delete()
  @ApiOperation({ summary: 'Delete user rating for a prompt' })
  @ApiResponse({ status: 200, description: 'Rating deleted successfully' })
  @ApiResponse({ status: 404, description: 'Rating not found' })
  async delete(@Param('promptId', ParseIntPipe) promptId: number, @Req() req: Request) {
    const user = req.user as UserEntity;
    await this.promptRatingsService.delete(promptId, user.id);
    return { message: 'Rating deleted successfully' };
  }
}
