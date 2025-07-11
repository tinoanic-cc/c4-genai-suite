import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { LocalAuthGuard } from '../../domain/auth';
import { UserEntity } from '../../domain/database';
import { CreatePromptRatingDto, PromptRatingResponseDto, UpdatePromptRatingDto } from '../../domain/prompts';
import { PromptMapper } from '../../domain/prompts/mappers/prompt.mapper';
import { PromptRatingsService } from '../../domain/prompts/prompt-ratings.service';

@ApiTags('prompt-ratings')
@UseGuards(LocalAuthGuard)
@Controller('prompts/:promptId/ratings')
export class PromptRatingsController {
  constructor(private readonly promptRatingsService: PromptRatingsService) {}

  @Post()
  @ApiOperation({ summary: 'Rate a prompt' })
  @ApiResponse({ status: 201, description: 'Rating created successfully', type: PromptRatingResponseDto })
  @ApiResponse({ status: 400, description: 'User has already rated this prompt' })
  async create(
    @Param('promptId', ParseIntPipe) promptId: number,
    @Req() req: Request,
    @Body() createPromptRatingDto: CreatePromptRatingDto,
  ): Promise<PromptRatingResponseDto> {
    const user = req.user as UserEntity;
    const entity = await this.promptRatingsService.create(promptId, user.id, createPromptRatingDto);
    return PromptMapper.toRatingResponseDto(entity);
  }

  @Get()
  @ApiOperation({ summary: 'Get all ratings for a prompt' })
  @ApiResponse({ status: 200, description: 'List of ratings', type: [PromptRatingResponseDto] })
  async findByPrompt(@Param('promptId', ParseIntPipe) promptId: number): Promise<PromptRatingResponseDto[]> {
    const entities = await this.promptRatingsService.findByPrompt(promptId);
    return entities.map((entity) => PromptMapper.toRatingResponseDto(entity));
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
    return PromptMapper.toRatingResponseDto(rating);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get rating statistics for a prompt' })
  @ApiResponse({ status: 200, description: 'Rating statistics' })
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
    const entity = await this.promptRatingsService.update(promptId, user.id, updatePromptRatingDto);
    return PromptMapper.toRatingResponseDto(entity);
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
