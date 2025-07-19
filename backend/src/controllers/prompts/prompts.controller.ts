import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { LocalAuthGuard } from '../../domain/auth';
import { PromptEntity, PromptVersionEntity, UserEntity } from '../../domain/database';
import {
  CreatePromptDto,
  PaginatedPromptsResponseDto,
  PaginationOptions,
  PromptFilters,
  PromptResponseDto,
  PromptVersionResponseDto,
  UpdatePromptDto,
} from '../../domain/prompts/dtos';
import { PromptsService } from '../../domain/prompts/prompts.service';

@ApiTags('prompts')
@UseGuards(LocalAuthGuard)
@Controller('prompts')
export class PromptsController {
  constructor(private readonly promptsService: PromptsService) {}

  private transformToPromptResponseDto(prompt: PromptEntity): PromptResponseDto {
    return {
      id: prompt.id,
      title: prompt.title,
      content: prompt.content,
      description: prompt.description,
      isPublic: prompt.isPublic,
      averageRating: prompt.averageRating,
      ratingCount: prompt.ratingCount,
      usageCount: prompt.usageCount,
      createdAt: prompt.createdAt.toISOString(),
      updatedAt: prompt.updatedAt.toISOString(),
      category: prompt.category
        ? {
            id: prompt.category.id,
            name: prompt.category.name,
            description: prompt.category.description,
            color: prompt.category.color,
            sortOrder: prompt.category.sortOrder,
            createdAt: prompt.category.createdAt.toISOString(),
            updatedAt: prompt.category.updatedAt.toISOString(),
          }
        : undefined,
      author: prompt.author
        ? {
            id: parseInt(prompt.author.id.toString(), 10),
            name: prompt.author.name,
          }
        : undefined,
    };
  }

  private transformToPromptVersionResponseDto(version: PromptVersionEntity): PromptVersionResponseDto {
    return {
      id: version.id,
      content: version.content,
      version: version.versionNumber,
      createdAt: version.createdAt.toISOString(),
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create a new prompt' })
  @ApiResponse({ status: 201, description: 'Prompt created successfully', type: PromptResponseDto })
  async create(@Req() req: Request, @Body() createPromptDto: CreatePromptDto): Promise<PromptResponseDto> {
    const user = req.user as UserEntity;
    const prompt = await this.promptsService.create(user.id, createPromptDto);
    return this.transformToPromptResponseDto(prompt);
  }

  @Get()
  @ApiOperation({ summary: 'Get all public prompts and own private prompts' })
  @ApiResponse({ status: 200, description: 'Paginated list of prompts', type: PaginatedPromptsResponseDto })
  async findAll(
    @Req() req: Request,
    @Query('categoryId') categoryId?: number,
    @Query('search') search?: string,
    @Query('minRating') minRating?: number,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: 'createdAt' | 'updatedAt' | 'averageRating' | 'usageCount' | 'title',
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
  ): Promise<PaginatedPromptsResponseDto> {
    const user = req.user as UserEntity;
    const filters: PromptFilters = {
      categoryId,
      search,
      minRating,
    };

    const pagination: PaginationOptions = {
      page,
      limit,
      sortBy,
      sortOrder,
    };

    const result = await this.promptsService.findAll(filters, pagination, user?.id);

    const totalPages = Math.ceil(result.total / result.limit);

    return {
      items: result.items.map((prompt) => this.transformToPromptResponseDto(prompt)),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages,
    };
  }

  @Get('my')
  @ApiOperation({ summary: 'Get current user prompts' })
  @ApiResponse({ status: 200, description: 'Paginated list of user prompts', type: PaginatedPromptsResponseDto })
  async findMy(
    @Req() req: Request,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: 'createdAt' | 'updatedAt' | 'averageRating' | 'usageCount' | 'title',
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
  ): Promise<PaginatedPromptsResponseDto> {
    const user = req.user as UserEntity;
    const pagination: PaginationOptions = {
      page,
      limit,
      sortBy,
      sortOrder,
    };

    const result = await this.promptsService.findByAuthor(user.id, pagination);
    const totalPages = Math.ceil(result.total / result.limit);

    return {
      items: result.items.map((prompt) => this.transformToPromptResponseDto(prompt)),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages,
    };
  }

  @Get('popular')
  @ApiOperation({ summary: 'Get popular prompts' })
  @ApiResponse({ status: 200, description: 'List of popular prompts', type: [PromptResponseDto] })
  async getPopular(@Query('limit') limit?: number): Promise<PromptResponseDto[]> {
    const prompts = await this.promptsService.getPopularPrompts(limit);
    return prompts.map((prompt) => this.transformToPromptResponseDto(prompt));
  }

  @Get('recent')
  @ApiOperation({ summary: 'Get recent prompts' })
  @ApiResponse({ status: 200, description: 'List of recent prompts', type: [PromptResponseDto] })
  async getRecent(@Query('limit') limit?: number): Promise<PromptResponseDto[]> {
    const prompts = await this.promptsService.getRecentPrompts(limit);
    return prompts.map((prompt) => this.transformToPromptResponseDto(prompt));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get prompt by ID' })
  @ApiResponse({ status: 200, description: 'Prompt details', type: PromptResponseDto })
  @ApiResponse({ status: 404, description: 'Prompt not found' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<PromptResponseDto> {
    const prompt = await this.promptsService.findOne(id);
    if (!prompt) {
      throw new NotFoundException('Prompt not found');
    }
    return this.transformToPromptResponseDto(prompt);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update prompt (creates new version)' })
  @ApiResponse({ status: 200, description: 'Prompt updated successfully', type: PromptResponseDto })
  @ApiResponse({ status: 404, description: 'Prompt not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
    @Body() updatePromptDto: UpdatePromptDto,
  ): Promise<PromptResponseDto> {
    const user = req.user as UserEntity;
    const prompt = await this.promptsService.createVersion(id, user.id, updatePromptDto);
    return this.transformToPromptResponseDto(prompt);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete prompt' })
  @ApiResponse({ status: 200, description: 'Prompt deleted successfully' })
  @ApiResponse({ status: 404, description: 'Prompt not found' })
  async delete(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const user = req.user as UserEntity;
    await this.promptsService.delete(id, user.id);
    return { message: 'Prompt deleted successfully' };
  }

  @Post(':id/clone')
  @ApiOperation({ summary: 'Clone a prompt' })
  @ApiResponse({ status: 201, description: 'Prompt cloned successfully', type: PromptResponseDto })
  @ApiResponse({ status: 404, description: 'Prompt not found' })
  async clone(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
    @Body('title') title?: string,
  ): Promise<PromptResponseDto> {
    const user = req.user as UserEntity;
    const prompt = await this.promptsService.clone(id, user.id, title);
    return this.transformToPromptResponseDto(prompt);
  }

  @Post(':id/use')
  @ApiOperation({ summary: 'Record prompt usage' })
  @ApiResponse({ status: 200, description: 'Usage recorded successfully' })
  async recordUsage(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const user = req.user as UserEntity;
    await this.promptsService.recordUsage(id, user.id);
    return { message: 'Usage recorded successfully' };
  }

  @Put(':id/visibility')
  @ApiOperation({ summary: 'Toggle prompt visibility (public/private)' })
  @ApiResponse({ status: 200, description: 'Visibility updated successfully', type: PromptResponseDto })
  @ApiResponse({ status: 404, description: 'Prompt not found' })
  async toggleVisibility(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
    @Body('isPublic') isPublic: boolean,
  ): Promise<PromptResponseDto> {
    const user = req.user as UserEntity;
    const prompt = await this.promptsService.update(id, user.id, { isPublic });
    return this.transformToPromptResponseDto(prompt);
  }

  // Versioning endpoints
  @Get(':id/versions')
  @ApiOperation({ summary: 'Get all versions of a prompt' })
  @ApiResponse({ status: 200, description: 'List of prompt versions', type: [PromptVersionResponseDto] })
  async getVersions(@Param('id', ParseIntPipe) id: number): Promise<PromptVersionResponseDto[]> {
    const versions = await this.promptsService.getVersions(id);
    return versions.map((version) => this.transformToPromptVersionResponseDto(version));
  }

  @Get(':id/versions/:version')
  @ApiOperation({ summary: 'Get specific version of a prompt' })
  @ApiResponse({ status: 200, description: 'Prompt version details', type: PromptVersionResponseDto })
  @ApiResponse({ status: 404, description: 'Version not found' })
  async getVersion(
    @Param('id', ParseIntPipe) id: number,
    @Param('version', ParseIntPipe) version: number,
  ): Promise<PromptVersionResponseDto> {
    const promptVersion = await this.promptsService.getVersion(id, version);
    if (!promptVersion) {
      throw new NotFoundException('Version not found');
    }
    return this.transformToPromptVersionResponseDto(promptVersion);
  }

  @Post(':id/restore/:version')
  @ApiOperation({ summary: 'Restore a specific version of a prompt' })
  @ApiResponse({ status: 200, description: 'Version restored successfully', type: PromptResponseDto })
  @ApiResponse({ status: 404, description: 'Version not found' })
  async restoreVersion(
    @Param('id', ParseIntPipe) id: number,
    @Param('version', ParseIntPipe) version: number,
    @Req() req: Request,
    @Body('versionComment') versionComment: string,
  ): Promise<PromptResponseDto> {
    const user = req.user as UserEntity;
    const prompt = await this.promptsService.restoreVersion(id, version, user.id, versionComment);
    return this.transformToPromptResponseDto(prompt);
  }
}
