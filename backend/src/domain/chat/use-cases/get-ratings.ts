import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { UsageEntity, UsageRepository } from 'src/domain/database';
import { GroupBy } from '../statistics';

export class GetRatings {
  constructor(
    public readonly since: Date | undefined,
    public readonly groupBy: GroupBy,
  ) {}
}

export class GetRatingsResponse {
  constructor(public readonly ratings: Rating[]) {}
}

export interface Rating {
  // The date key.
  date: Date;

  // The total number of ratings.
  total: number;

  // The ratings per category
  byCategory: Record<string, number>;
}

@QueryHandler(GetRatings)
export class GetRatingsHandler implements IQueryHandler<GetRatings, GetRatingsResponse> {
  constructor(
    @InjectRepository(UsageEntity)
    private readonly usages: UsageRepository,
  ) {}

  async execute(query: GetRatings): Promise<GetRatingsResponse> {
    const result = await this.usages.getRatingCount(query.since, query.groupBy);

    return new GetRatingsResponse(result);
  }
}
