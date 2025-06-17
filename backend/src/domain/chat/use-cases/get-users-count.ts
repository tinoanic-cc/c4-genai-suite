import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { ConversationEntity, ConversationRepository, UsagesCount } from '../../database';
import { GroupBy } from '../statistics';

export class GetUsersCount {
  constructor(
    public readonly since: Date | undefined,
    public readonly groupBy: GroupBy,
  ) {}
}

export class GetUsersCountResponse {
  constructor(public readonly requests: UsagesCount[]) {}
}

@QueryHandler(GetUsersCount)
export class GetUsersCountHandler implements IQueryHandler<GetUsersCount, GetUsersCountResponse> {
  constructor(
    @InjectRepository(ConversationEntity)
    private readonly conversations: ConversationRepository,
  ) {}

  async execute(query: GetUsersCount): Promise<GetUsersCountResponse> {
    const result = await this.conversations.getUsersCountByPeriod(query.since, query.groupBy);
    return new GetUsersCountResponse(result);
  }
}
