import { BadRequestException, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/domain/users';
import { FileEntity, FileRepository } from '../../database';
import { buildClient } from './utils';

export class GetDocumentContent {
  constructor(
    public readonly user: User,
    public readonly docId: number,
    public readonly chunkIds: string[],
  ) {}
}

export class GetDocumentContentResponse {
  constructor(public readonly documentContent: Array<string | null>) {}
}

@QueryHandler(GetDocumentContent)
export class GetDocumentContentHandler implements IQueryHandler<GetDocumentContent, GetDocumentContentResponse> {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: FileRepository,
  ) {}

  async execute(query: GetDocumentContent): Promise<GetDocumentContentResponse> {
    const { user, docId, chunkIds } = query;

    if (!docId) {
      throw new BadRequestException('File ID is required');
    }

    if (!chunkIds || chunkIds.length === 0) throw new BadRequestException('Chunk IDs are required');

    const file = await this.fileRepository.findOne({
      where: { docId },
      relations: {
        bucket: true,
      },
    });
    if (!file) {
      throw new NotFoundException(`Cannot find a file with docId ${docId} for this user`);
    }
    if (file.bucket?.type != 'general' && file.userId != user.id) {
      throw new NotFoundException(`Cannot find a file with docId ${docId} for this user`);
    }

    const api = file.bucket ? buildClient(file.bucket) : undefined;

    const result = await api?.getDocumentsContent(chunkIds, file.bucket?.indexName);

    return new GetDocumentContentResponse(result ?? []);
  }
}
