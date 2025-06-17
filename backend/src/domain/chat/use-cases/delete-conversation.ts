import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { ConversationEntity, ConversationRepository } from 'src/domain/database';
import { User } from 'src/domain/users';

export class DeleteConversation {
  constructor(
    public readonly id: number,
    public readonly user: User,
  ) {}
}

export class DeleteConversationResponse {}

@CommandHandler(DeleteConversation)
export class DeleteConversationHandler implements ICommandHandler<DeleteConversation, DeleteConversationResponse> {
  constructor(
    @InjectRepository(ConversationEntity)
    private readonly conversations: ConversationRepository,
  ) {}

  async execute(command: DeleteConversation): Promise<DeleteConversationResponse> {
    const { id, user } = command;

    const entity = await this.conversations.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException();
    }

    if (entity.userId !== user.id) {
      throw new ForbiddenException();
    }

    await this.conversations.delete({ id: entity.id });

    return new DeleteConversationResponse();
  }
}
