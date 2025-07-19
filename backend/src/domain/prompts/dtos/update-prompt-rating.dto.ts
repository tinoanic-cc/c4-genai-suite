import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class UpdatePromptRatingDto {
  @ApiPropertyOptional({
    description: 'Rating value between 1 and 5',
    minimum: 1,
    maximum: 5,
    example: 4,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Rating must be a number' })
  @Min(1, { message: 'Rating must be at least 1' })
  @Max(5, { message: 'Rating must be at most 5' })
  rating?: number;

  @ApiPropertyOptional({
    description: 'Optional comment for the rating',
    maxLength: 1000,
    example: 'Great prompt, very helpful!',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Comment must not exceed 1000 characters' })
  comment?: string;
}
