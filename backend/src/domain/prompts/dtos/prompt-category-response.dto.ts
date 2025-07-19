import { ApiProperty } from '@nestjs/swagger';

export class PromptCategoryResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the category',
    example: 1,
  })
  id!: number;

  @ApiProperty({
    description: 'Name of the category',
    example: 'Code Review',
  })
  name!: string;

  @ApiProperty({
    description: 'Description of the category',
    example: 'Templates for code review and analysis',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Hex color code for the category',
    example: '#3B82F6',
    required: false,
  })
  color?: string;

  @ApiProperty({
    description: 'Sort order for displaying categories',
    example: 1,
    required: false,
  })
  sortOrder?: number;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-15T10:30:00Z',
  })
  updatedAt!: Date;
}

export class PromptCategoryWithCountResponseDto extends PromptCategoryResponseDto {
  @ApiProperty({
    description: 'Number of prompts in this category',
    example: 5,
  })
  promptCount!: number;
}
