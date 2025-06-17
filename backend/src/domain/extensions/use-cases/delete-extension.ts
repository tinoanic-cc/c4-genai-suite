import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtensionEntity, ExtensionRepository } from 'src/domain/database';

export class DeleteExtension {
  constructor(public readonly id: number) {}
}

@CommandHandler(DeleteExtension)
export class DeleteExtensionHandler implements ICommandHandler<DeleteExtension, any> {
  constructor(
    @InjectRepository(ExtensionEntity)
    private readonly extensions: ExtensionRepository,
  ) {}

  async execute(command: DeleteExtension): Promise<any> {
    const result = await this.extensions.delete({ id: command.id });

    if (!result.affected) {
      throw new NotFoundException();
    }
  }
}
