import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString, Length, MaxLength } from 'class-validator';

export class UpdatePromptDto {
  @ApiPropertyOptional({
    description: 'Updated title of the prompt',
    minLength: 1,
    maxLength: 200,
    example: 'Enhanced Code Review Assistant',
  })
  @IsOptional()
  @IsString()
  @Length(1, 200, { message: 'Title must be between 1 and 200 characters' })
  title?: string;

  @ApiPropertyOptional({
    description: 'Updated content/template of the prompt',
    minLength: 1,
    maxLength: 10000,
    example: 'Please review the following code and provide detailed feedback on...',
  })
  @IsOptional()
  @IsString()
  @Length(1, 10000, { message: 'Content must be between 1 and 10000 characters' })
  content?: string;

  @ApiPropertyOptional({
    description: 'Updated description of what the prompt does',
    maxLength: 1000,
    example: 'An enhanced prompt template for conducting comprehensive code reviews',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Description must not exceed 1000 characters' })
  description?: string;

  @ApiPropertyOptional({
    description: 'Updated category ID for the prompt',
    type: 'integer',
    example: 2,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Category ID must be a number' })
  categoryId?: number;

  @ApiPropertyOptional({
    description: 'Updated visibility setting for the prompt',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @ApiPropertyOptional({
    description: 'Comment describing the changes made in this version',
    minLength: 1,
    maxLength: 500,
    example: 'Added more detailed feedback criteria',
  })
  @IsOptional()
  @IsString()
  @Length(1, 500, { message: 'Version comment must be between 1 and 500 characters' })
  versionComment?: string;
}
