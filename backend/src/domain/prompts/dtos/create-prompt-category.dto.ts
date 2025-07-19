import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsHexColor, IsNumber, IsOptional, IsString, Length, MaxLength } from 'class-validator';

export class CreatePromptCategoryDto {
  @ApiProperty({
    description: 'The name of the prompt category',
    minLength: 1,
    maxLength: 100,
    example: 'Code Review',
  })
  @IsString()
  @Length(1, 100, { message: 'Name must be between 1 and 100 characters' })
  name!: string;

  @ApiPropertyOptional({
    description: 'Optional description of the category',
    maxLength: 500,
    example: 'Templates for code review and analysis',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Description must not exceed 500 characters' })
  description?: string;

  @ApiPropertyOptional({
    description: 'Hex color code for the category',
    pattern: '^#[0-9A-Fa-f]{6}$',
    example: '#3B82F6',
  })
  @IsOptional()
  @IsString()
  @IsHexColor({ message: 'Color must be a valid hex color code' })
  color?: string;

  @ApiPropertyOptional({
    description: 'Sort order for displaying categories',
    type: 'integer',
    example: 1,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Sort order must be a number' })
  sortOrder?: number;
}
