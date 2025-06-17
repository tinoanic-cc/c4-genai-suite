import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { ConversationEntity, ConversationRepository } from 'src/domain/database';
import { User } from 'src/domain/users';

export class DeleteConversations {
  constructor(public readonly user: User) {}
}

export class DeleteConversationsResponse {}

@CommandHandler(DeleteConversations)
export class DeleteConversationsHandler implements ICommandHandler<DeleteConversations, DeleteConversationsResponse> {
  constructor(
    @InjectRepository(ConversationEntity)
    private readonly conversations: ConversationRepository,
  ) {}

  async execute(command: DeleteConversations): Promise<DeleteConversationsResponse> {
    const { user } = command;

    if (user?.id != null) {
      await this.conversations.delete({ userId: user.id });
    }

    return new DeleteConversationsResponse();
  }
}
