import { ApiProperty } from '@nestjs/swagger';

export class PromptCategoryResponseDto {
  @ApiProperty({ description: 'Unique identifier of the category' })
  id!: number;

  @ApiProperty({ description: 'Name of the category' })
  name!: string;

  @ApiProperty({ description: 'Description of the category', required: false })
  description?: string;

  @ApiProperty({ description: 'Color code for UI', required: false })
  color?: string;

  @ApiProperty({ description: 'Sort order' })
  sortOrder!: number;

  @ApiProperty({ description: 'Creation date' })
  createdAt!: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt!: Date;
}

export class PromptCategoryWithCountResponseDto extends PromptCategoryResponseDto {
  @ApiProperty({ description: 'Number of prompts in this category' })
  promptCount!: number;
}
