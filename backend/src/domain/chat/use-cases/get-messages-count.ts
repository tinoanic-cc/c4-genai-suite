import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity, MessageRepository, MessagesCount } from '../../database';
import { GroupBy } from '../statistics';

export class GetMessagesCount {
  constructor(
    public readonly since: Date | undefined,
    public readonly groupBy: GroupBy,
  ) {}
}

export class GetMessagesCountResponse {
  constructor(public readonly requests: MessagesCount[]) {}
}

@QueryHandler(GetMessagesCount)
export class GetMessagesCountHandler implements IQueryHandler<GetMessagesCount, GetMessagesCountResponse> {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messages: MessageRepository,
  ) {}

  async execute(query: GetMessagesCount): Promise<GetMessagesCountResponse> {
    const result = await this.messages.getMessageCount(query.since, query.groupBy);
    return new GetMessagesCountResponse(result);
  }
}
