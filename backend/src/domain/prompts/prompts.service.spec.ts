/* eslint-disable @typescript-eslint/unbound-method, @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PromptEntity, PromptRatingEntity, PromptUsageEntity, PromptVersionEntity } from '../database';
import { CreatePromptDto, UpdatePromptDto } from './interfaces';
import { PromptsService } from './prompts.service';

describe('PromptsService', () => {
  let service: PromptsService;
  let promptRepository: jest.Mocked<Repository<PromptEntity>>;
  let promptUsageRepository: jest.Mocked<Repository<PromptUsageEntity>>;
  let promptRatingRepository: jest.Mocked<Repository<PromptRatingEntity>>;
  let promptVersionRepository: jest.Mocked<Repository<PromptVersionEntity>>;

  const mockPrompt = {
    id: 1,
    title: 'Test Prompt',
    content: 'Test content',
    description: 'Test description',
    isPublic: true,
    originalPromptId: undefined,
    usageCount: 0,
    averageRating: 0,
    ratingCount: 0,
    authorId: 'user1',
    categoryId: 1,
    currentVersion: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    author: { id: 'user1', name: 'Test User' },
    ratings: [],
    usages: [],
    versions: [],
  } as unknown as PromptEntity;

  beforeEach(async () => {
    const mockQueryBuilder = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([[mockPrompt], 1]),
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([]),
      getRawOne: jest.fn().mockResolvedValue({ averageRating: '4.5', ratingCount: '10' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PromptsService,
        {
          provide: getRepositoryToken(PromptEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
            increment: jest.fn(),
            update: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
          },
        },
        {
          provide: getRepositoryToken(PromptUsageEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(PromptRatingEntity),
          useValue: {
            createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
          },
        },
        {
          provide: getRepositoryToken(PromptVersionEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PromptsService>(PromptsService);
    promptRepository = module.get(getRepositoryToken(PromptEntity));
    promptUsageRepository = module.get(getRepositoryToken(PromptUsageEntity));
    promptRatingRepository = module.get(getRepositoryToken(PromptRatingEntity));
    promptVersionRepository = module.get(getRepositoryToken(PromptVersionEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new public prompt', async () => {
      const createPromptDto: CreatePromptDto = {
        title: 'Test Prompt',
        content: 'Test content',
        description: 'Test description',
        categoryId: 1,
        isPublic: true,
      };

      promptRepository.create.mockReturnValue(mockPrompt);
      promptRepository.save.mockResolvedValue(mockPrompt);
      promptVersionRepository.create.mockReturnValue({} as PromptVersionEntity);
      promptVersionRepository.save.mockResolvedValue({} as PromptVersionEntity);

      const result = await service.create('user1', createPromptDto);

      expect(promptRepository.create).toHaveBeenCalledWith({
        ...createPromptDto,
        authorId: 'user1',
      });
      expect(promptRepository.save).toHaveBeenCalledWith(mockPrompt);
      expect(result).toEqual(mockPrompt);
      expect(result.isPublic).toBe(true);
    });

    it('should create a new private prompt', async () => {
      const createPromptDto: CreatePromptDto = {
        title: 'Private Test Prompt',
        content: 'Private test content',
        description: 'Private test description',
        categoryId: 1,
        isPublic: false,
      };

      const privatePrompt = { ...mockPrompt, isPublic: false };
      promptRepository.create.mockReturnValue(privatePrompt);
      promptRepository.save.mockResolvedValue(privatePrompt);
      promptVersionRepository.create.mockReturnValue({} as PromptVersionEntity);
      promptVersionRepository.save.mockResolvedValue({} as PromptVersionEntity);

      const result = await service.create('user1', createPromptDto);

      expect(promptRepository.create).toHaveBeenCalledWith({
        ...createPromptDto,
        authorId: 'user1',
      });
      expect(promptRepository.save).toHaveBeenCalledWith(privatePrompt);
      expect(result.isPublic).toBe(false);
    });

    it('should create a prompt with default visibility when isPublic is not specified', async () => {
      const createPromptDto: CreatePromptDto = {
        title: 'Default Visibility Prompt',
        content: 'Default visibility content',
        description: 'Default visibility description',
        categoryId: 1,
      };

      promptRepository.create.mockReturnValue(mockPrompt);
      promptRepository.save.mockResolvedValue(mockPrompt);
      promptVersionRepository.create.mockReturnValue({} as PromptVersionEntity);
      promptVersionRepository.save.mockResolvedValue({} as PromptVersionEntity);

      const result = await service.create('user1', createPromptDto);

      expect(promptRepository.create).toHaveBeenCalledWith({
        ...createPromptDto,
        authorId: 'user1',
      });
      expect(promptRepository.save).toHaveBeenCalledWith(mockPrompt);
      expect(result).toEqual(mockPrompt);
      // Should default to public based on entity definition
      expect(result.isPublic).toBe(true);
    });
  });

  describe('findOne', () => {
    it('should return a prompt by id', async () => {
      promptRepository.findOne.mockResolvedValue(mockPrompt);

      const result = await service.findOne(1);

      expect(promptRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['author', 'category', 'originalPrompt', 'ratings'],
      });
      expect(result).toEqual(mockPrompt);
    });
  });

  describe('update', () => {
    it('should update a prompt', async () => {
      const updatePromptDto: UpdatePromptDto = {
        title: 'Updated Title',
        content: 'Updated content',
      };

      promptRepository.findOne.mockResolvedValue(mockPrompt);
      promptRepository.save.mockResolvedValue({ ...mockPrompt, ...updatePromptDto });

      const result = await service.update(1, 'user1', updatePromptDto);

      expect(promptRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, authorId: 'user1' },
      });
      expect(promptRepository.save).toHaveBeenCalled();
      expect(result.title).toBe('Updated Title');
    });

    it('should update prompt visibility from public to private', async () => {
      const updatePromptDto: UpdatePromptDto = {
        isPublic: false,
      };

      promptRepository.findOne.mockResolvedValue(mockPrompt);
      promptRepository.save.mockResolvedValue({ ...mockPrompt, isPublic: false });

      const result = await service.update(1, 'user1', updatePromptDto);

      expect(promptRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, authorId: 'user1' },
      });
      expect(promptRepository.save).toHaveBeenCalled();
      expect(result.isPublic).toBe(false);
    });

    it('should update prompt visibility from private to public', async () => {
      const privatePrompt = { ...mockPrompt, isPublic: false };
      const updatePromptDto: UpdatePromptDto = {
        isPublic: true,
      };

      promptRepository.findOne.mockResolvedValue(privatePrompt);
      promptRepository.save.mockResolvedValue({ ...privatePrompt, isPublic: true });

      const result = await service.update(1, 'user1', updatePromptDto);

      expect(promptRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, authorId: 'user1' },
      });
      expect(promptRepository.save).toHaveBeenCalled();
      expect(result.isPublic).toBe(true);
    });

    it('should throw error if prompt not found', async () => {
      promptRepository.findOne.mockResolvedValue(null);

      await expect(service.update(1, 'user1', { title: 'Updated' })).rejects.toThrow('Prompt not found');
    });
  });

  describe('delete', () => {
    it('should delete a prompt', async () => {
      promptRepository.delete.mockResolvedValue({ affected: 1, raw: {} });

      await service.delete(1, 'user1');

      expect(promptRepository.delete).toHaveBeenCalledWith({
        id: 1,
        authorId: 'user1',
      });
    });

    it('should throw error if prompt not found', async () => {
      promptRepository.delete.mockResolvedValue({ affected: 0, raw: {} });

      await expect(service.delete(1, 'user1')).rejects.toThrow('Prompt not found');
    });
  });

  describe('clone', () => {
    it('should clone a public prompt', async () => {
      const publicPrompt = { ...mockPrompt, isPublic: true };
      const clonedPrompt = { ...mockPrompt, id: 2, title: 'Custom Title', isPublic: false };

      promptRepository.findOne.mockResolvedValue(publicPrompt);
      promptRepository.create.mockReturnValue(clonedPrompt);
      promptRepository.save.mockResolvedValue(clonedPrompt);

      const result = await service.clone(1, 'user2', 'Custom Title');

      expect(promptRepository.create).toHaveBeenCalledWith({
        title: 'Custom Title',
        content: publicPrompt.content,
        description: publicPrompt.description,
        categoryId: publicPrompt.categoryId,
        authorId: 'user2',
        originalPromptId: publicPrompt.id,
        isPublic: false,
      });
      expect(result).toEqual(clonedPrompt);
    });

    it('should clone a public prompt with default title', async () => {
      const publicPrompt = { ...mockPrompt, isPublic: true };
      const clonedPrompt = { ...mockPrompt, id: 2, title: 'Test Prompt (Copy)', isPublic: false };

      promptRepository.findOne.mockResolvedValue(publicPrompt);
      promptRepository.create.mockReturnValue(clonedPrompt);
      promptRepository.save.mockResolvedValue(clonedPrompt);

      const result = await service.clone(1, 'user2');

      // The service uses the original prompt's title, which might be different from mockPrompt.title
      expect(promptRepository.create).toHaveBeenCalledWith({
        title: expect.stringContaining('(Copy)') as string,
        content: publicPrompt.content,
        description: publicPrompt.description,
        categoryId: publicPrompt.categoryId,
        authorId: 'user2',
        originalPromptId: publicPrompt.id,
        isPublic: false,
      });
      expect(result.isPublic).toBe(false); // Cloned prompts should always be private
    });

    it('should throw error if prompt is not public', async () => {
      const privatePrompt = { ...mockPrompt, isPublic: false };
      promptRepository.findOne.mockResolvedValue(privatePrompt);

      await expect(service.clone(1, 'user2')).rejects.toThrow('Prompt is not public');
    });

    it('should throw error if prompt does not exist', async () => {
      promptRepository.findOne.mockResolvedValue(null);

      await expect(service.clone(999, 'user2')).rejects.toThrow('Prompt not found');
    });
  });

  describe('recordUsage', () => {
    it('should record prompt usage', async () => {
      const mockUsage = {} as PromptUsageEntity;
      promptUsageRepository.create.mockReturnValue(mockUsage);
      promptUsageRepository.save.mockResolvedValue(mockUsage);
      promptRepository.increment.mockResolvedValue({ affected: 1, raw: {}, generatedMaps: [] });

      await service.recordUsage(1, 'user1');

      expect(promptUsageRepository.create).toHaveBeenCalledWith({
        promptId: 1,
        userId: 'user1',
      });
      expect(promptRepository.increment).toHaveBeenCalledWith({ id: 1 }, 'usageCount', 1);
    });
  });

  describe('createVersion', () => {
    it('should create a new version', async () => {
      const updateData: UpdatePromptDto = {
        title: 'Updated Title',
        content: 'Updated content',
        versionComment: 'Updated for testing',
      };

      promptRepository.findOne.mockResolvedValue(mockPrompt);
      promptVersionRepository.update.mockResolvedValue({ affected: 1, raw: {}, generatedMaps: [] });
      promptVersionRepository.create.mockReturnValue({} as PromptVersionEntity);
      promptVersionRepository.save.mockResolvedValue({} as PromptVersionEntity);
      promptRepository.save.mockResolvedValue({ ...mockPrompt, currentVersion: 2 });

      const result = await service.createVersion(1, 'user1', updateData);

      expect(promptVersionRepository.update).toHaveBeenCalledWith({ promptId: 1, isCurrent: true }, { isCurrent: false });
      expect(result.currentVersion).toBe(2);
    });

    it('should throw error if version comment is missing', async () => {
      promptRepository.findOne.mockResolvedValue(mockPrompt);

      await expect(service.createVersion(1, 'user1', { title: 'Updated' })).rejects.toThrow('Version comment is required');
    });
  });

  describe('getVersions', () => {
    it('should return prompt versions', async () => {
      const mockVersions = [
        { id: 1, versionNumber: 1 },
        { id: 2, versionNumber: 2 },
      ] as PromptVersionEntity[];

      promptVersionRepository.find.mockResolvedValue(mockVersions);

      const result = await service.getVersions(1);

      expect(promptVersionRepository.find).toHaveBeenCalledWith({
        where: { promptId: 1 },
        order: { versionNumber: 'DESC' },
        relations: ['author'],
      });
      expect(result).toEqual(mockVersions);
    });
  });
});
