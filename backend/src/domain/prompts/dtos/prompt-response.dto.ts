import { ApiProperty } from '@nestjs/swagger';
import { PromptCategoryResponseDto } from './prompt-category-response.dto';

export class PromptResponseDto {
  @ApiProperty({ description: 'Unique identifier of the prompt' })
  id!: number;

  @ApiProperty({ description: 'Title of the prompt' })
  title!: string;

  @ApiProperty({ description: 'Content of the prompt' })
  content!: string;

  @ApiProperty({ description: 'Description of the prompt', required: false })
  description?: string;

  @ApiProperty({ description: 'Whether the prompt is public' })
  isPublic!: boolean;

  @ApiProperty({ description: 'ID of the prompt author' })
  authorId!: string;

  @ApiProperty({ description: 'Category ID', required: false })
  categoryId?: number;

  @ApiProperty({ description: 'Category details', required: false })
  category?: PromptCategoryResponseDto;

  @ApiProperty({ description: 'Average rating', required: false })
  averageRating?: number;

  @ApiProperty({ description: 'Number of ratings' })
  ratingCount!: number;

  @ApiProperty({ description: 'Usage count' })
  usageCount!: number;

  @ApiProperty({ description: 'Current version number' })
  currentVersion!: number;

  @ApiProperty({ description: 'Creation date' })
  createdAt!: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt!: Date;

  @ApiProperty({ description: 'Author details' })
  author!: {
    id: string;
    name: string;
    email: string;
  };
}
