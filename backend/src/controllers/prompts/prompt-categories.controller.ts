import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { LocalAuthGuard } from '../../domain/auth';
import { PromptCategoryEntity, UserEntity } from '../../domain/database';
import {
  CreatePromptCategoryDto,
  PromptCategoriesService,
  PromptCategoryResponseDto,
  PromptCategoryWithCountResponseDto,
  UpdatePromptCategoryDto,
} from '../../domain/prompts';

@ApiTags('prompt-categories')
@UseGuards(LocalAuthGuard)
@Controller('prompt-categories')
export class PromptCategoriesController {
  constructor(private readonly promptCategoriesService: PromptCategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new prompt category' })
  @ApiResponse({ status: 201, description: 'Category created successfully', type: PromptCategoryResponseDto })
  async create(@Body() createPromptCategoryDto: CreatePromptCategoryDto): Promise<PromptCategoryResponseDto> {
    const category = await this.promptCategoriesService.create(createPromptCategoryDto);
    return this.transformToPromptCategoryResponseDto(category);
  }

  @Get()
  @ApiOperation({ summary: 'Get all prompt categories' })
  @ApiResponse({ status: 200, description: 'List of categories', type: [PromptCategoryResponseDto] })
  async findAll(): Promise<PromptCategoryResponseDto[]> {
    const categories = await this.promptCategoriesService.findAll();
    return categories.map((category) => this.transformToPromptCategoryResponseDto(category));
  }

  @Get('with-counts')
  @ApiOperation({ summary: 'Get all categories with prompt counts' })
  @ApiResponse({ status: 200, description: 'List of categories with prompt counts', type: [PromptCategoryWithCountResponseDto] })
  async findAllWithCounts(@Req() req: Request): Promise<PromptCategoryWithCountResponseDto[]> {
    const user = req.user as UserEntity;
    const categoriesWithCounts = await this.promptCategoriesService.getCategoriesWithPromptCount(user?.id);
    return categoriesWithCounts.map((categoryWithCount) => this.transformToPromptCategoryWithCountResponseDto(categoryWithCount));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiResponse({ status: 200, description: 'Category details', type: PromptCategoryResponseDto })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<PromptCategoryResponseDto> {
    const category = await this.promptCategoriesService.findOne(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return this.transformToPromptCategoryResponseDto(category);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update category' })
  @ApiResponse({ status: 200, description: 'Category updated successfully', type: PromptCategoryResponseDto })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePromptCategoryDto: UpdatePromptCategoryDto,
  ): Promise<PromptCategoryResponseDto> {
    const category = await this.promptCategoriesService.update(id, updatePromptCategoryDto);
    return this.transformToPromptCategoryResponseDto(category);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete category' })
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.promptCategoriesService.delete(id);
    return { message: 'Category deleted successfully' };
  }

  private transformToPromptCategoryResponseDto(category: PromptCategoryEntity): PromptCategoryResponseDto {
    return {
      id: category.id,
      name: category.name,
      description: category.description,
      color: category.color,
      sortOrder: category.sortOrder,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
    };
  }

  private transformToPromptCategoryWithCountResponseDto(
    categoryWithCount: PromptCategoryEntity & { promptCount: number },
  ): PromptCategoryWithCountResponseDto {
    return {
      id: categoryWithCount.id,
      name: categoryWithCount.name,
      description: categoryWithCount.description,
      color: categoryWithCount.color,
      sortOrder: categoryWithCount.sortOrder,
      createdAt: categoryWithCount.createdAt.toISOString(),
      updatedAt: categoryWithCount.updatedAt.toISOString(),
      promptCount: categoryWithCount.promptCount || 0,
    };
  }
}
