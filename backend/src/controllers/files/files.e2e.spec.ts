import { Server } from 'net';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { DataSource, Repository } from 'typeorm';
import { AppModule } from '../../app.module';
import { BucketEntity, FileEntity, FileUploadStatus } from '../../domain/database';
import { buildClient } from '../../domain/files/use-cases/utils';
import { initAppWithDataBaseAndValidUser } from '../../utils/testUtils';
import { FilesController } from './files.controller';

jest.mock('../../domain/files/use-cases/utils', () => ({
  buildClient: jest.fn(),
}));

describe('Files', () => {
  let controller: FilesController;
  let app: INestApplication<Server>;
  let dataSource: DataSource;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    controller = module.get(FilesController);

    const initialized = await initAppWithDataBaseAndValidUser(dataSource, module, app);
    dataSource = initialized.dataSource;
    app = initialized.app;
    await seedTestData(dataSource);

    (buildClient as jest.Mock).mockImplementation(() => ({
      getDocumentsContent: jest.fn().mockResolvedValue(['content1', 'content2']),
    }));
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should return bad request when fileId is missing', async () => {
    const response = await request(app.getHttpServer()).get('/buckets/documents/0/content').expect(HttpStatus.BAD_REQUEST);
    const body = response.body as { message: string[] };
    expect(body).toBeDefined();
    expect(body.message).toBe('File ID is required');
  });
  it('should return bad request when fileId is given but chunk ids are missing', async () => {
    const existingDocId = 1;
    const response = await request(app.getHttpServer())
      .get(`/buckets/documents/${existingDocId}/content`)
      .expect(HttpStatus.BAD_REQUEST);
    const body = response.body as { message: string[] };
    expect(body).toBeDefined();
    expect(body.message).toBe('Chunk IDs are required');
  });
  it('should return file not found if file does not exist', async () => {
    const notExistingDocId = 2;
    const response = await request(app.getHttpServer())
      .get(`/buckets/documents/${notExistingDocId}/content`)
      .query({ chunkIds: ['chunk1', 'chunk2'] })
      .expect(404);
    const body = response.body as { message: string[] };
    expect(body).toBeDefined();
    expect(body.message).toBe(`Cannot find a file with docId ${notExistingDocId} for this user`);
  });
  it('should return document content for chunk ids', async () => {
    const existingDocId = 1;
    const chunkIds = ['chunk1', 'chunk2'];
    const response = await request(app.getHttpServer())
      .get(`/buckets/documents/${existingDocId}/content`)
      .query({ chunkIds: chunkIds })
      .expect(200);

    const body = response.body as string[];
    expect(body).toBeDefined();
    expect(body).toHaveLength(2);
    expect(body).toEqual(['content1', 'content2']);
  });
});

async function seedTestData(dataSource: DataSource) {
  const bucketRepository = dataSource.getRepository(BucketEntity);
  await createBucketEntity(bucketRepository);
  const fileRepository = dataSource.getRepository(FileEntity);
  await createFileEntity(fileRepository);
}

function createFileEntity(fileRepository: Repository<FileEntity>): Promise<FileEntity> {
  const fileEntity = new FileEntity();
  fileEntity.id = 1;
  fileEntity.mimeType = 'txt/plain';
  fileEntity.fileSize = 100;
  fileEntity.fileName = 'test';
  fileEntity.bucketId = 1;
  fileEntity.uploadStatus = FileUploadStatus.Successful;
  return fileRepository.save(fileEntity);
}

function createBucketEntity(bucketRepository: Repository<BucketEntity>): Promise<BucketEntity> {
  const bucketEntity = new BucketEntity();
  bucketEntity.id = 1;
  bucketEntity.name = 'bucket-test';
  bucketEntity.type = 'general';
  bucketEntity.isDefault = false;
  bucketEntity.endpoint = 'http://localhost:123';
  return bucketRepository.save(bucketEntity);
}
