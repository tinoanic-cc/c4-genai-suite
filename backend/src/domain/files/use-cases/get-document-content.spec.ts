import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/domain/users';
import { FileEntity, FileRepository } from '../../database';
import { GetDocumentContent, GetDocumentContentHandler, GetDocumentContentResponse } from './get-document-content';
import { buildClient } from './utils';

jest.mock('./utils', () => ({
  buildClient: jest.fn(),
}));

describe('Get Document Content', () => {
  let fileRepository: FileRepository;
  let handler: GetDocumentContentHandler;

  const mockUser: User = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    userGroupId: 'group1',
  };

  beforeAll(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetDocumentContentHandler,
        {
          provide: getRepositoryToken(FileEntity),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get(GetDocumentContentHandler);
    fileRepository = module.get<FileRepository>(getRepositoryToken(FileEntity));
  });

  it('should throw not found exception if bucket not found', async () => {
    const command = new GetDocumentContent(mockUser, 1, ['chunk1', 'chunk2']);
    await expect(handler.execute(command)).rejects.toThrow(NotFoundException);
  });

  it.each([[null], ['test-index']])(
    'should return document content when bucket exists and index name is %p',
    async (indexName) => {
      const fileId = 1;
      const bucketId = 1;
      const chunkIds = ['chunk1', 'chunk2'];
      const mockBucket = { id: fileId, bucket: { id: bucketId, type: 'general', indexName: indexName } } as FileEntity;
      const mockClient = { getDocumentsContent: jest.fn().mockResolvedValue(['content1', 'content2']) };

      jest.spyOn(fileRepository, 'findOne').mockResolvedValueOnce(mockBucket);
      (buildClient as jest.Mock).mockReturnValue(mockClient);

      const result = await handler.execute(new GetDocumentContent(mockUser, bucketId, chunkIds));

      expect(result).toEqual(new GetDocumentContentResponse(['content1', 'content2']));
      expect(jest.spyOn(fileRepository, 'findOne')).toHaveBeenCalledWith({
        where: { docId: fileId },
        relations: { bucket: true },
      });
      expect(mockClient.getDocumentsContent).toHaveBeenCalledWith(chunkIds, indexName);
    },
  );

  it('should throw not found exception if user is not allowed', async () => {
    const fileId = 1;
    const bucketId = 1;
    const chunkIds = ['chunk1', 'chunk2'];
    const mockBucket = { id: fileId, bucket: { id: bucketId, type: 'user' }, userId: '2' } as FileEntity;
    const mockClient = { getDocumentsContent: jest.fn().mockResolvedValue(['content1', 'content2']) };

    jest.spyOn(fileRepository, 'findOne').mockResolvedValueOnce(mockBucket);
    (buildClient as jest.Mock).mockReturnValue(mockClient);

    const command = new GetDocumentContent(mockUser, bucketId, chunkIds);

    await expect(handler.execute(command)).rejects.toThrow(NotFoundException);
  });
});
