import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../app.module';

describe('PromptsController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/prompts (GET)', () => {
    it('should return prompts list', () => {
      return request(app.getHttpServer())
        .get('/prompts')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('items');
          expect(res.body).toHaveProperty('total');
          expect(res.body).toHaveProperty('page');
          expect(res.body).toHaveProperty('limit');
          expect(Array.isArray(res.body.items)).toBe(true);
        });
    });
  });

  describe('/prompts/categories (GET)', () => {
    it('should return prompt categories', () => {
      return request(app.getHttpServer())
        .get('/prompts/categories')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('/prompts (POST)', () => {
    it('should create a new prompt', () => {
      const createPromptDto = {
        title: 'Test Prompt',
        content: 'Test content for the prompt',
        description: 'Test description',
        isPublic: true,
      };

      return request(app.getHttpServer())
        .post('/prompts')
        .send(createPromptDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.title).toBe(createPromptDto.title);
          expect(res.body.content).toBe(createPromptDto.content);
        });
    });

    it('should validate required fields', () => {
      const invalidPromptDto = {
        description: 'Missing title and content',
      };

      return request(app.getHttpServer()).post('/prompts').send(invalidPromptDto).expect(400);
    });

    it('should validate title length', () => {
      const invalidPromptDto = {
        title: 'a'.repeat(201), // Too long
        content: 'Valid content',
      };

      return request(app.getHttpServer()).post('/prompts').send(invalidPromptDto).expect(400);
    });
  });
});
