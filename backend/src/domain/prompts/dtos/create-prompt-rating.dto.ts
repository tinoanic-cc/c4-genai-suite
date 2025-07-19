import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class CreatePromptRatingDto {
  @ApiProperty({
    description: 'Rating value from 1 to 5 stars',
    type: 'integer',
    minimum: 1,
    maximum: 5,
    example: 4,
  })
  @IsInt({ message: 'Rating must be an integer' })
  @Min(1, { message: 'Rating must be at least 1' })
  @Max(5, { message: 'Rating must be at most 5' })
  rating!: number;

  @ApiPropertyOptional({
    description: 'Optional comment about the prompt',
    maxLength: 1000,
    example: 'This prompt helped me write better code reviews',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Comment must not exceed 1000 characters' })
  comment?: string;
}
