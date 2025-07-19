import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreatePromptCategoryDto,
  PromptCategoryResponseDto,
  PromptCategoryWithCountResponseDto,
  UpdatePromptCategoryDto,
} from '../../domain/prompts/dtos';
import { PromptCategoriesService } from '../../domain/prompts/prompt-categories.service';

@ApiTags('prompt-categories')
@Controller('prompt-categories')
export class TaskCategoriesController {
  constructor(private readonly promptCategoriesService: PromptCategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new prompt category' })
  @ApiResponse({ status: 201, description: 'Category created successfully', type: PromptCategoryResponseDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async create(@Body() createPromptCategoryDto: CreatePromptCategoryDto): Promise<PromptCategoryResponseDto> {
    return this.promptCategoriesService.createDto(createPromptCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all prompt categories' })
  @ApiResponse({ status: 200, description: 'List of categories', type: [PromptCategoryResponseDto] })
  async findAll(): Promise<PromptCategoryResponseDto[]> {
    return this.promptCategoriesService.findAllDto();
  }

  @Get('with-counts')
  @ApiOperation({ summary: 'Get all categories with prompt counts' })
  @ApiResponse({ status: 200, description: 'List of categories with prompt counts', type: [PromptCategoryWithCountResponseDto] })
  async findAllWithCounts(): Promise<PromptCategoryWithCountResponseDto[]> {
    return this.promptCategoriesService.findAllWithCountsDto();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiResponse({ status: 200, description: 'Category details', type: PromptCategoryResponseDto })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<PromptCategoryResponseDto> {
    const category = await this.promptCategoriesService.findOneDto(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update category' })
  @ApiResponse({ status: 200, description: 'Category updated successfully', type: PromptCategoryResponseDto })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePromptCategoryDto: UpdatePromptCategoryDto,
  ): Promise<PromptCategoryResponseDto> {
    return this.promptCategoriesService.updateDto(id, updatePromptCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete category' })
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.promptCategoriesService.delete(id);
    return { message: 'Category deleted successfully' };
  }
}
