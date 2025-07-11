export { CreatePromptDto } from './create-prompt.dto';
export { UpdatePromptDto } from './update-prompt.dto';
export { CreatePromptRatingDto } from './create-prompt-rating.dto';
export { CreatePromptCategoryDto } from './create-prompt-category.dto';

// Response DTOs
export { PromptResponseDto } from './prompt-response.dto';
export { PromptCategoryResponseDto, PromptCategoryWithCountResponseDto } from './prompt-category-response.dto';
export { PromptRatingResponseDto, PromptRatingStatsResponseDto } from './prompt-rating-response.dto';

// Query DTOs
export { PromptFiltersDto, PaginationOptionsDto, PaginatedResponseDto, PromptSortBy, SortOrder } from './prompt-query.dto';

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

// Legacy interfaces - to be replaced gradually
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
