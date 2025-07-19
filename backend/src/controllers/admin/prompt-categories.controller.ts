import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard, Role, RoleGuard } from '../../domain/auth';
import { BUILTIN_USER_GROUP_ADMIN } from '../../domain/database';
import {
  CreatePromptCategoryDto,
  PromptCategoriesService,
  PromptCategoryResponseDto,
  PromptCategoryWithCountResponseDto,
  UpdatePromptCategoryDto,
} from '../../domain/prompts';

@ApiTags('admin-prompt-categories')
@Controller('admin/prompt-categories')
@UseGuards(LocalAuthGuard)
export class AdminPromptCategoriesController {
  constructor(private readonly promptCategoriesService: PromptCategoriesService) {}

  @Post()
  @Role(BUILTIN_USER_GROUP_ADMIN)
  @UseGuards(RoleGuard)
  @ApiOperation({ summary: 'Create a new prompt category' })
  @ApiResponse({ status: 201, description: 'Category created successfully', type: PromptCategoryResponseDto })
  async create(@Body() createPromptCategoryDto: CreatePromptCategoryDto): Promise<PromptCategoryResponseDto> {
    return this.promptCategoriesService.createDto(createPromptCategoryDto);
  }

  @Get()
  @Role(BUILTIN_USER_GROUP_ADMIN)
  @UseGuards(RoleGuard)
  @ApiOperation({ summary: 'Get all prompt categories' })
  @ApiResponse({ status: 200, description: 'List of categories', type: [PromptCategoryResponseDto] })
  async findAll(): Promise<PromptCategoryResponseDto[]> {
    return this.promptCategoriesService.findAllDto();
  }

  @Get('with-counts')
  @Role(BUILTIN_USER_GROUP_ADMIN)
  @UseGuards(RoleGuard)
  @ApiOperation({ summary: 'Get all categories with prompt counts' })
  @ApiResponse({ status: 200, description: 'List of categories with prompt counts', type: [PromptCategoryWithCountResponseDto] })
  async findAllWithCounts(): Promise<PromptCategoryWithCountResponseDto[]> {
    return this.promptCategoriesService.findAllWithCountsDto();
  }

  @Get(':id')
  @Role(BUILTIN_USER_GROUP_ADMIN)
  @UseGuards(RoleGuard)
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
  @Role(BUILTIN_USER_GROUP_ADMIN)
  @UseGuards(RoleGuard)
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
  @Role(BUILTIN_USER_GROUP_ADMIN)
  @UseGuards(RoleGuard)
  @ApiOperation({ summary: 'Delete category' })
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.promptCategoriesService.delete(id);
    return { message: 'Category deleted successfully' };
  }
}
