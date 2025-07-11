import { PromptEntity } from '../../database/entities/prompt';
import { PromptCategoryEntity } from '../../database/entities/prompt-category';
import { PromptRatingEntity } from '../../database/entities/prompt-rating';
import {
  PaginatedResponseDto,
  PromptCategoryResponseDto,
  PromptCategoryWithCountResponseDto,
  PromptRatingResponseDto,
  PromptResponseDto,
} from '../dtos';

export class PromptMapper {
  static toPromptResponseDto(entity: PromptEntity): PromptResponseDto {
    return {
      id: entity.id,
      title: entity.title,
      content: entity.content,
      description: entity.description,
      isPublic: entity.isPublic,
      authorId: entity.authorId,
      categoryId: entity.categoryId,
      averageRating: entity.averageRating,
      ratingCount: entity.ratingCount,
      usageCount: entity.usageCount,
      version: entity.currentVersion,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static toCategoryResponseDto(entity: PromptCategoryEntity): PromptCategoryResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      color: entity.color,
      sortOrder: entity.sortOrder,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static toCategoryWithCountResponseDto(
    entity: PromptCategoryEntity & { promptCount: number },
  ): PromptCategoryWithCountResponseDto {
    return {
      ...this.toCategoryResponseDto(entity),
      promptCount: entity.promptCount,
    };
  }

  static toRatingResponseDto(entity: PromptRatingEntity): PromptRatingResponseDto {
    return {
      id: entity.id,
      promptId: entity.promptId,
      userId: entity.userId,
      rating: entity.rating,
      comment: entity.comment,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static toPaginatedResponse<T, U>(
    entities: T[],
    total: number,
    page: number,
    limit: number,
    mapper: (entity: T) => U,
  ): PaginatedResponseDto<U> {
    const totalPages = Math.ceil(total / limit);

    return {
      items: entities.map(mapper),
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    };
  }
}
