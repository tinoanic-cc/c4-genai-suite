/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument, @typescript-eslint/unbound-method */
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PromptRatingEntity, UserEntity } from '../../domain/database';
import { CreatePromptRatingDto, UpdatePromptRatingDto } from '../../domain/prompts/dtos';
import { PromptRatingsService } from '../../domain/prompts/prompt-ratings.service';
import { PromptRatingsController } from './prompt-ratings.controller';

describe('PromptRatingsController', () => {
  let controller: PromptRatingsController;
  let service: PromptRatingsService;

  const mockUser: UserEntity = {
    id: '123',
    name: 'Test User',
    email: 'test@example.com',
  } as UserEntity;

  const mockRating: PromptRatingEntity & { user?: UserEntity } = {
    id: 1,
    rating: 4,
    comment: 'Great prompt!',
    promptId: 1,
    userId: 'user-123',
    createdAt: new Date('2024-01-15T10:30:00Z'),
    updatedAt: new Date('2024-01-15T10:30:00Z'),
    user: mockUser,
  } as PromptRatingEntity & { user?: UserEntity };

  const mockPromptRatingsService = {
    create: jest.fn(),
    findByPrompt: jest.fn(),
    findUserRating: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    getPromptRatingStats: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PromptRatingsController],
      providers: [
        {
          provide: PromptRatingsService,
          useValue: mockPromptRatingsService,
        },
      ],
    }).compile();

    controller = module.get<PromptRatingsController>(PromptRatingsController);
    service = module.get<PromptRatingsService>(PromptRatingsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new rating', async () => {
      const createDto: CreatePromptRatingDto = {
        rating: 4,
        comment: 'Great prompt!',
      };

      const req = { user: mockUser } as any;

      mockPromptRatingsService.create.mockResolvedValue(mockRating);

      const result = await controller.create(1, req, createDto);

      expect(service.create).toHaveBeenCalledWith(1, '123', createDto);
      expect(result).toEqual({
        id: 1,
        rating: 4,
        comment: 'Great prompt!',
        createdAt: '2024-01-15T10:30:00.000Z',
        author: {
          id: 123,
          name: 'Test User',
        },
      });
    });

    it('should handle service errors during creation', async () => {
      const createDto: CreatePromptRatingDto = {
        rating: 4,
        comment: 'Great prompt!',
      };

      const req = { user: mockUser } as any;

      mockPromptRatingsService.create.mockRejectedValue(new Error('Service error'));

      await expect(controller.create(1, req, createDto)).rejects.toThrow('Service error');
    });
  });

  describe('findByPrompt', () => {
    it('should return all ratings for a prompt', async () => {
      const ratings = [mockRating, { ...mockRating, id: 2, rating: 5 }];

      mockPromptRatingsService.findByPrompt.mockResolvedValue(ratings);

      const result = await controller.findByPrompt(1);

      expect(service.findByPrompt).toHaveBeenCalledWith(1);
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: 1,
        rating: 4,
        comment: 'Great prompt!',
        createdAt: '2024-01-15T10:30:00.000Z',
        author: {
          id: 123,
          name: 'Test User',
        },
      });
    });

    it('should return empty array when no ratings exist', async () => {
      mockPromptRatingsService.findByPrompt.mockResolvedValue([]);

      const result = await controller.findByPrompt(1);

      expect(service.findByPrompt).toHaveBeenCalledWith(1);
      expect(result).toEqual([]);
    });
  });

  describe('findMyRating', () => {
    it('should return user rating for a prompt', async () => {
      const req = { user: mockUser } as any;

      mockPromptRatingsService.findUserRating.mockResolvedValue(mockRating);

      const result = await controller.findMyRating(1, req);

      expect(service.findUserRating).toHaveBeenCalledWith(1, '123');
      expect(result).toEqual({
        id: 1,
        rating: 4,
        comment: 'Great prompt!',
        createdAt: '2024-01-15T10:30:00.000Z',
        author: {
          id: 123,
          name: 'Test User',
        },
      });
    });

    it('should throw NotFoundException when rating does not exist', async () => {
      const req = { user: mockUser } as any;

      mockPromptRatingsService.findUserRating.mockResolvedValue(null);

      await expect(controller.findMyRating(1, req)).rejects.toThrow(NotFoundException);
      expect(service.findUserRating).toHaveBeenCalledWith(1, '123');
    });
  });

  describe('getStats', () => {
    it('should return rating statistics', async () => {
      const stats = {
        averageRating: 4.2,
        totalRatings: 15,
        ratingDistribution: {
          '1': 1,
          '2': 2,
          '3': 3,
          '4': 4,
          '5': 5,
        },
      };

      mockPromptRatingsService.getPromptRatingStats.mockResolvedValue(stats);

      const result = await controller.getStats(1);

      expect(service.getPromptRatingStats).toHaveBeenCalledWith(1);
      expect(result).toEqual(stats);
    });
  });

  describe('update', () => {
    it('should update a rating successfully', async () => {
      const updateDto: UpdatePromptRatingDto = {
        rating: 5,
        comment: 'Updated comment',
      };

      const updatedRating = {
        ...mockRating,
        rating: 5,
        comment: 'Updated comment',
      };

      const req = { user: mockUser } as any;

      mockPromptRatingsService.update.mockResolvedValue(updatedRating);

      const result = await controller.update(1, req, updateDto);

      expect(service.update).toHaveBeenCalledWith(1, '123', updateDto);
      expect(result).toEqual({
        id: 1,
        rating: 5,
        comment: 'Updated comment',
        createdAt: '2024-01-15T10:30:00.000Z',
        author: {
          id: 123,
          name: 'Test User',
        },
      });
    });

    it('should handle partial updates', async () => {
      const updateDto: UpdatePromptRatingDto = {
        rating: 5,
      };

      const updatedRating = {
        ...mockRating,
        rating: 5,
      };

      const req = { user: mockUser } as any;

      mockPromptRatingsService.update.mockResolvedValue(updatedRating);

      const result = await controller.update(1, req, updateDto);

      expect(service.update).toHaveBeenCalledWith(1, '123', updateDto);
      expect(result.rating).toBe(5);
      expect(result.comment).toBe('Great prompt!'); // Original comment preserved
    });

    it('should handle service errors during update', async () => {
      const updateDto: UpdatePromptRatingDto = {
        rating: 5,
      };

      const req = { user: mockUser } as any;

      mockPromptRatingsService.update.mockRejectedValue(new Error('Service error'));

      await expect(controller.update(1, req, updateDto)).rejects.toThrow('Service error');
    });
  });

  describe('delete', () => {
    it('should delete a rating successfully', async () => {
      const req = { user: mockUser } as any;

      mockPromptRatingsService.delete.mockResolvedValue(undefined);

      const result = await controller.delete(1, req);

      expect(service.delete).toHaveBeenCalledWith(1, '123');
      expect(result).toEqual({ message: 'Rating deleted successfully' });
    });

    it('should handle service errors during deletion', async () => {
      const req = { user: mockUser } as any;

      mockPromptRatingsService.delete.mockRejectedValue(new Error('Service error'));

      await expect(controller.delete(1, req)).rejects.toThrow('Service error');
    });
  });

  describe('DTO transformation', () => {
    it('should handle ratings without user information', async () => {
      const ratingWithoutUser = {
        ...mockRating,
        user: undefined,
      };

      mockPromptRatingsService.findByPrompt.mockResolvedValue([ratingWithoutUser]);

      const result = await controller.findByPrompt(1);

      expect(result[0].author).toBeUndefined();
    });

    it('should handle user ID conversion correctly', async () => {
      const userWithNumericId = {
        ...mockUser,
        id: 456,
      };

      const ratingWithNumericUserId = {
        ...mockRating,
        user: userWithNumericId,
      };

      mockPromptRatingsService.findByPrompt.mockResolvedValue([ratingWithNumericUserId]);

      const result = await controller.findByPrompt(1);

      expect(result[0].author?.id).toBe(456);
    });
  });

  describe('error handling', () => {
    it('should propagate service exceptions', async () => {
      const req = { user: mockUser } as any;

      mockPromptRatingsService.findUserRating.mockRejectedValue(new Error('Database error'));

      await expect(controller.findMyRating(1, req)).rejects.toThrow('Database error');
    });

    it('should handle unexpected errors gracefully', async () => {
      const req = { user: mockUser } as any;

      mockPromptRatingsService.create.mockRejectedValue(new Error('Unexpected error'));

      await expect(controller.create(1, req, { rating: 4 })).rejects.toThrow('Unexpected error');
    });
  });

  describe('input validation', () => {
    it('should handle empty update DTOs', async () => {
      const updateDto: UpdatePromptRatingDto = {};
      const req = { user: mockUser } as any;

      mockPromptRatingsService.update.mockResolvedValue(mockRating);

      const result = await controller.update(1, req, updateDto);

      expect(service.update).toHaveBeenCalledWith(1, '123', updateDto);
      expect(result).toBeDefined();
    });
  });
});
