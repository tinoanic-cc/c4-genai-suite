import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString, Length, MaxLength } from 'class-validator';

export class CreatePromptDto {
  @ApiProperty({
    description: 'The title of the prompt',
    minLength: 1,
    maxLength: 200,
    example: 'Code Review Assistant',
  })
  @IsString()
  @Length(1, 200, { message: 'Title must be between 1 and 200 characters' })
  title!: string;

  @ApiProperty({
    description: 'The content/template of the prompt',
    minLength: 1,
    maxLength: 10000,
    example: 'Please review the following code and provide feedback on...',
  })
  @IsString()
  @Length(1, 10000, { message: 'Content must be between 1 and 10000 characters' })
  content!: string;

  @ApiPropertyOptional({
    description: 'Optional description of what the prompt does',
    maxLength: 1000,
    example: 'A prompt template for conducting thorough code reviews',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Description must not exceed 1000 characters' })
  description?: string;

  @ApiPropertyOptional({
    description: 'ID of the category this prompt belongs to',
    type: 'integer',
    example: 1,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Category ID must be a number' })
  categoryId?: number;

  @ApiPropertyOptional({
    description: 'Whether the prompt is publicly visible',
    default: false,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}
