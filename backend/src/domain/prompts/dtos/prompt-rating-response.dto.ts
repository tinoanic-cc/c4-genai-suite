import { ApiProperty } from '@nestjs/swagger';

export class PromptRatingResponseDto {
  @ApiProperty({ description: 'Unique identifier of the rating' })
  id!: number;

  @ApiProperty({ description: 'ID of the prompt being rated' })
  promptId!: number;

  @ApiProperty({ description: 'ID of the user who rated' })
  userId!: string;

  @ApiProperty({ description: 'Rating value (1-5)' })
  rating!: number;

  @ApiProperty({ description: 'Optional comment', required: false })
  comment?: string;

  @ApiProperty({ description: 'Creation date' })
  createdAt!: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt!: Date;
}

export class PromptRatingStatsResponseDto {
  @ApiProperty({ description: 'Average rating' })
  averageRating!: number;

  @ApiProperty({ description: 'Total number of ratings' })
  totalRatings!: number;

  @ApiProperty({ description: 'Rating distribution by value' })
  ratingDistribution!: Record<number, number>;
}
