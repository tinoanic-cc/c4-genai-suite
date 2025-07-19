export { CreatePromptDto } from './create-prompt.dto';
export { UpdatePromptDto } from './update-prompt.dto';
export { CreatePromptRatingDto } from './create-prompt-rating.dto';
export { CreatePromptCategoryDto } from './create-prompt-category.dto';
export { UpdatePromptCategoryDto } from './update-prompt-category.dto';
export { PromptSortBy, SortOrder } from './prompt-sort.enum';

// Import enums for use in interfaces
import { PromptSortBy, SortOrder } from './prompt-sort.enum';

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
  sortBy?: PromptSortBy;
  sortOrder?: SortOrder;
}
