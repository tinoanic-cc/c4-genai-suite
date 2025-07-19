export { CreatePromptDto } from './create-prompt.dto';
export { UpdatePromptDto } from './update-prompt.dto';
export { CreatePromptRatingDto } from './create-prompt-rating.dto';
export { CreatePromptCategoryDto } from './create-prompt-category.dto';

// Export response DTOs
export {
  PromptResponseDto,
  PromptCategoryResponseDto,
  PromptCategoryWithCountResponseDto,
  PromptVersionResponseDto,
  PromptRatingResponseDto,
  PromptAuthorResponseDto,
  PaginatedPromptsResponseDto,
} from './prompt-response.dto';

// Re-export interfaces that are still used
export interface UpdatePromptRatingDto {
  rating?: number;
  comment?: string;
}

export interface UpdatePromptCategoryDto {
  name?: string;
  description?: string;
  color?: string;
  sortOrder?: number;
}

export interface PromptFilters {
  isPublic?: boolean;
  categoryId?: number;
  search?: string;
  authorId?: string;
  minRating?: number;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'averageRating' | 'usageCount' | 'title';
  sortOrder?: 'ASC' | 'DESC';
}
