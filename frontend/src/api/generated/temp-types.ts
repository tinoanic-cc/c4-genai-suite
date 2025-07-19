// Temporary types to bridge the gap until response DTOs are properly generated
// These should be replaced with generated types once the backend controllers use response DTOs

export interface Prompt {
  id: number;
  title: string;
  content: string;
  description?: string;
  isPublic: boolean;
  averageRating?: number;
  ratingCount?: number;
  usageCount?: number;
  createdAt: string;
  updatedAt: string;
  category?: PromptCategory;
  author?: {
    id: number;
    name: string;
  };
}

export interface PromptCategory {
  id: number;
  name: string;
  color?: string;
  description?: string;
  promptCount?: number;
  sortOrder?: number;
  createdAt: string;
  updatedAt: string;
}

export interface PromptVersion {
  id: number;
  content: string;
  createdAt: string;
  version: number;
}

// Re-export the generated DTOs
export type { CreatePromptDto, CreatePromptCategoryDto, CreatePromptRatingDto, UpdatePromptDto } from './models';
