import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

export enum PromptSortBy {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  AVERAGE_RATING = 'averageRating',
  USAGE_COUNT = 'usageCount',
  TITLE = 'title',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class PromptFiltersDto {
  @ApiProperty({ description: 'Filter by category ID', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  categoryId?: number;

  @ApiProperty({ description: 'Search term for title and content', required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ description: 'Minimum rating filter', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  minRating?: number;

  @ApiProperty({ description: 'Filter by author ID', required: false })
  @IsOptional()
  @IsString()
  authorId?: string;

  @ApiProperty({ description: 'Filter by public/private status', required: false })
  @IsOptional()
  isPublic?: boolean;
}

export class PaginationOptionsDto {
  @ApiProperty({ description: 'Page number (1-based)', required: false, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiProperty({ description: 'Number of items per page', required: false, default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiProperty({
    description: 'Sort field',
    required: false,
    enum: PromptSortBy,
    default: PromptSortBy.CREATED_AT,
  })
  @IsOptional()
  @IsEnum(PromptSortBy)
  sortBy?: PromptSortBy;

  @ApiProperty({
    description: 'Sort order',
    required: false,
    enum: SortOrder,
    default: SortOrder.DESC,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder;
}

export class PaginatedResponseDto<T> {
  @ApiProperty({ description: 'Array of items' })
  items!: T[];

  @ApiProperty({ description: 'Total number of items' })
  total!: number;

  @ApiProperty({ description: 'Current page number' })
  page!: number;

  @ApiProperty({ description: 'Number of items per page' })
  limit!: number;

  @ApiProperty({ description: 'Total number of pages' })
  totalPages!: number;

  @ApiProperty({ description: 'Whether there is a next page' })
  hasNext!: boolean;

  @ApiProperty({ description: 'Whether there is a previous page' })
  hasPrevious!: boolean;
}
