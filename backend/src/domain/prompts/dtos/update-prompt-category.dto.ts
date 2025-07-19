import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsHexColor, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdatePromptCategoryDto {
  @ApiPropertyOptional({
    description: 'Category name',
    example: 'Development',
    minLength: 2,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @ApiPropertyOptional({
    description: 'Category description',
    example: 'Prompts related to software development',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Category color in hex format',
    example: '#3b82f6',
  })
  @IsOptional()
  @IsHexColor()
  color?: string;

  @ApiPropertyOptional({
    description: 'Sort order for category display',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}
