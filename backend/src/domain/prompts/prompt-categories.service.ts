import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PromptCategoryEntity } from '../database';
import { PromptCategoryResponseDto, PromptCategoryWithCountResponseDto } from './dtos/prompt-response.dto';
import { CreatePromptCategoryDto, UpdatePromptCategoryDto } from './interfaces';

@Injectable()
export class PromptCategoriesService {
  constructor(
    @InjectRepository(PromptCategoryEntity)
    private readonly promptCategoryRepository: Repository<PromptCategoryEntity>,
  ) {}

  async create(createPromptCategoryDto: CreatePromptCategoryDto): Promise<PromptCategoryEntity> {
    const category = this.promptCategoryRepository.create(createPromptCategoryDto);
    return this.promptCategoryRepository.save(category);
  }

  async findAll(): Promise<PromptCategoryEntity[]> {
    return this.promptCategoryRepository.find({
      order: { sortOrder: 'ASC', name: 'ASC' },
      relations: ['prompts'],
    });
  }

  async findOne(id: number): Promise<PromptCategoryEntity | null> {
    return this.promptCategoryRepository.findOne({
      where: { id },
      relations: ['prompts'],
    });
  }

  async findByName(name: string): Promise<PromptCategoryEntity | null> {
    return this.promptCategoryRepository.findOne({
      where: { name },
    });
  }

  async update(id: number, updatePromptCategoryDto: UpdatePromptCategoryDto): Promise<PromptCategoryEntity> {
    const category = await this.promptCategoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    Object.assign(category, updatePromptCategoryDto);
    return this.promptCategoryRepository.save(category);
  }

  async delete(id: number): Promise<void> {
    const result = await this.promptCategoryRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Category not found');
    }
  }

  async getCategoriesWithPromptCount(currentUserId?: string): Promise<Array<PromptCategoryEntity & { promptCount: number }>> {
    // Get all categories first
    const allCategories = await this.promptCategoryRepository.find({
      order: { sortOrder: 'ASC', name: 'ASC' },
    });

    // For each category, count prompts with the same visibility filter as PromptsService
    const categoriesWithCounts = await Promise.all(
      allCategories.map(async (category) => {
        const promptQueryBuilder = this.promptCategoryRepository.manager
          .createQueryBuilder()
          .select('COUNT(prompt.id)', 'promptCount')
          .from('prompts', 'prompt')
          .where('prompt.categoryId = :categoryId', { categoryId: category.id });

        // Apply same visibility filter as in PromptsService
        if (currentUserId) {
          promptQueryBuilder.andWhere('(prompt.isPublic = true OR prompt.authorId = :currentUserId)', { currentUserId });
        } else {
          promptQueryBuilder.andWhere('prompt.isPublic = true');
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const result = await promptQueryBuilder.getRawOne();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
        const promptCount = parseInt(result?.promptCount || '0') || 0;

        return {
          ...category,
          promptCount,
        };
      }),
    );

    return categoriesWithCounts;
  }

  // DTO methods for Admin API
  async createDto(createPromptCategoryDto: CreatePromptCategoryDto): Promise<PromptCategoryResponseDto> {
    const category = await this.create(createPromptCategoryDto);
    return this.toDto(category);
  }

  async findAllDto(): Promise<PromptCategoryResponseDto[]> {
    const categories = await this.promptCategoryRepository.find({
      order: { sortOrder: 'ASC', name: 'ASC' },
    });
    return categories.map((category) => this.toDto(category));
  }

  async findAllWithCountsDto(currentUserId?: string): Promise<PromptCategoryWithCountResponseDto[]> {
    const categoriesWithCounts = await this.getCategoriesWithPromptCount(currentUserId);
    return categoriesWithCounts.map((category) => this.toWithCountDto(category));
  }

  async findOneDto(id: number): Promise<PromptCategoryResponseDto | null> {
    const category = await this.promptCategoryRepository.findOne({
      where: { id },
    });
    return category ? this.toDto(category) : null;
  }

  async updateDto(id: number, updatePromptCategoryDto: UpdatePromptCategoryDto): Promise<PromptCategoryResponseDto> {
    const category = await this.update(id, updatePromptCategoryDto);
    return this.toDto(category);
  }

  private toDto(entity: PromptCategoryEntity): PromptCategoryResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      color: entity.color,
      sortOrder: entity.sortOrder,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }

  private toWithCountDto(entity: PromptCategoryEntity & { promptCount: number }): PromptCategoryWithCountResponseDto {
    return {
      ...this.toDto(entity),
      promptCount: entity.promptCount,
    };
  }
}
