import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PromptCategoryResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the category',
    type: 'integer',
    example: 1,
  })
  id!: number;

  @ApiProperty({
    description: 'Name of the category',
    example: 'Code Review',
  })
  name!: string;

  @ApiPropertyOptional({
    description: 'Description of the category',
    example: 'Templates for code review and analysis',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'Hex color code for the category',
    example: '#3B82F6',
  })
  color?: string;

  @ApiPropertyOptional({
    description: 'Sort order for displaying categories',
    type: 'integer',
    example: 1,
  })
  sortOrder?: number;

  @ApiProperty({
    description: 'Creation timestamp',
    type: 'string',
    format: 'date-time',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt!: string;

  @ApiProperty({
    description: 'Last update timestamp',
    type: 'string',
    format: 'date-time',
    example: '2024-01-15T10:30:00Z',
  })
  updatedAt!: string;
}

export class PromptCategoryWithCountResponseDto extends PromptCategoryResponseDto {
  @ApiProperty({
    description: 'Number of prompts in this category',
    type: 'integer',
    example: 5,
  })
  promptCount!: number;
}

export class PromptAuthorResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the author',
    type: 'integer',
    example: 1,
  })
  id!: number;

  @ApiProperty({
    description: 'Name of the author',
    example: 'John Doe',
  })
  name!: string;
}

export class PromptResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the prompt',
    type: 'integer',
    example: 1,
  })
  id!: number;

  @ApiProperty({
    description: 'Title of the prompt',
    example: 'Code Review Assistant',
  })
  title!: string;

  @ApiProperty({
    description: 'Content/template of the prompt',
    example: 'Please review the following code and provide feedback on...',
  })
  content!: string;

  @ApiPropertyOptional({
    description: 'Description of what the prompt does',
    example: 'A prompt template for conducting thorough code reviews',
  })
  description?: string;

  @ApiProperty({
    description: 'Whether the prompt is publicly visible',
    example: true,
  })
  isPublic!: boolean;

  @ApiPropertyOptional({
    description: 'Average rating of the prompt',
    type: 'number',
    format: 'float',
    example: 4.2,
  })
  averageRating?: number;

  @ApiPropertyOptional({
    description: 'Number of ratings received',
    type: 'integer',
    example: 15,
  })
  ratingCount?: number;

  @ApiPropertyOptional({
    description: 'Number of times the prompt has been used',
    type: 'integer',
    example: 42,
  })
  usageCount?: number;

  @ApiProperty({
    description: 'Creation timestamp',
    type: 'string',
    format: 'date-time',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt!: string;

  @ApiProperty({
    description: 'Last update timestamp',
    type: 'string',
    format: 'date-time',
    example: '2024-01-15T10:30:00Z',
  })
  updatedAt!: string;

  @ApiPropertyOptional({
    description: 'Category this prompt belongs to',
    type: () => PromptCategoryResponseDto,
  })
  category?: PromptCategoryResponseDto;

  @ApiPropertyOptional({
    description: 'Author of the prompt',
    type: () => PromptAuthorResponseDto,
  })
  author?: PromptAuthorResponseDto;
}

export class PromptVersionResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the version',
    type: 'integer',
    example: 1,
  })
  id!: number;

  @ApiProperty({
    description: 'Content of this version',
    example: 'Please review the following code and provide feedback on...',
  })
  content!: string;

  @ApiProperty({
    description: 'Version number',
    type: 'integer',
    example: 2,
  })
  version!: number;

  @ApiProperty({
    description: 'Creation timestamp',
    type: 'string',
    format: 'date-time',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt!: string;
}

export class PromptRatingResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the rating',
    type: 'integer',
    example: 1,
  })
  id!: number;

  @ApiProperty({
    description: 'Rating value from 1 to 5',
    type: 'integer',
    minimum: 1,
    maximum: 5,
    example: 4,
  })
  rating!: number;

  @ApiPropertyOptional({
    description: 'Optional comment about the prompt',
    example: 'This prompt helped me write better code reviews',
  })
  comment?: string;

  @ApiProperty({
    description: 'Creation timestamp',
    type: 'string',
    format: 'date-time',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt!: string;

  @ApiPropertyOptional({
    description: 'Author of the rating',
    type: () => PromptAuthorResponseDto,
  })
  author?: PromptAuthorResponseDto;
}
