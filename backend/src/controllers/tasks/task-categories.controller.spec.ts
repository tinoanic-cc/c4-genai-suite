/* eslint-disable @typescript-eslint/unbound-method */
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  CreatePromptCategoryDto,
  PromptCategoryResponseDto,
  PromptCategoryWithCountResponseDto,
  UpdatePromptCategoryDto,
} from '../../domain/prompts/dtos';
import { PromptCategoriesService } from '../../domain/prompts/prompt-categories.service';
import { TaskCategoriesController } from './task-categories.controller';

describe('TaskCategoriesController', () => {
  let controller: TaskCategoriesController;
  let service: PromptCategoriesService;

  const mockCategory: PromptCategoryResponseDto = {
    id: 1,
    name: 'Test Category',
    description: 'Test Description',
    color: '#FF0000',
    sortOrder: 1,
    createdAt: '2024-01-15T10:30:00.000Z',
    updatedAt: '2024-01-15T10:30:00.000Z',
  };

  const mockCategoryWithCount: PromptCategoryWithCountResponseDto = {
    ...mockCategory,
    promptCount: 5,
  };

  const mockPromptCategoriesService = {
    createDto: jest.fn(),
    findAllDto: jest.fn(),
    findAllWithCountsDto: jest.fn(),
    findOneDto: jest.fn(),
    updateDto: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskCategoriesController],
      providers: [
        {
          provide: PromptCategoriesService,
          useValue: mockPromptCategoriesService,
        },
      ],
    }).compile();

    controller = module.get<TaskCategoriesController>(TaskCategoriesController);
    service = module.get<PromptCategoriesService>(PromptCategoriesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new category', async () => {
      const createDto: CreatePromptCategoryDto = {
        name: 'Test Category',
        description: 'Test Description',
        color: '#FF0000',
      };

      mockPromptCategoriesService.createDto.mockResolvedValue(mockCategory);

      const result = await controller.create(createDto);

      expect(service.createDto).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockCategory);
    });

    it('should handle service errors during creation', async () => {
      const createDto: CreatePromptCategoryDto = {
        name: 'Test Category',
        description: 'Test Description',
      };

      mockPromptCategoriesService.createDto.mockRejectedValue(new Error('Service error'));

      await expect(controller.create(createDto)).rejects.toThrow('Service error');
    });
  });

  describe('findAll', () => {
    it('should return all categories', async () => {
      const categories = [mockCategory, { ...mockCategory, id: 2, name: 'Category 2' }];

      mockPromptCategoriesService.findAllDto.mockResolvedValue(categories);

      const result = await controller.findAll();

      expect(service.findAllDto).toHaveBeenCalled();
      expect(result).toEqual(categories);
    });

    it('should return empty array when no categories exist', async () => {
      mockPromptCategoriesService.findAllDto.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(service.findAllDto).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('findAllWithCounts', () => {
    it('should return all categories with prompt counts', async () => {
      const categoriesWithCounts = [
        mockCategoryWithCount,
        { ...mockCategoryWithCount, id: 2, name: 'Category 2', promptCount: 3 },
      ];

      mockPromptCategoriesService.findAllWithCountsDto.mockResolvedValue(categoriesWithCounts);

      const result = await controller.findAllWithCounts();

      expect(service.findAllWithCountsDto).toHaveBeenCalled();
      expect(result).toEqual(categoriesWithCounts);
    });

    it('should return empty array when no categories exist', async () => {
      mockPromptCategoriesService.findAllWithCountsDto.mockResolvedValue([]);

      const result = await controller.findAllWithCounts();

      expect(service.findAllWithCountsDto).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a category by ID', async () => {
      mockPromptCategoriesService.findOneDto.mockResolvedValue(mockCategory);

      const result = await controller.findOne(1);

      expect(service.findOneDto).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockCategory);
    });

    it('should throw NotFoundException when category does not exist', async () => {
      mockPromptCategoriesService.findOneDto.mockResolvedValue(null);

      await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
      expect(service.findOneDto).toHaveBeenCalledWith(999);
    });
  });

  describe('update', () => {
    it('should update a category successfully', async () => {
      const updateDto: UpdatePromptCategoryDto = {
        name: 'Updated Category',
        description: 'Updated Description',
      };

      const updatedCategory = {
        ...mockCategory,
        name: 'Updated Category',
        description: 'Updated Description',
      };

      mockPromptCategoriesService.updateDto.mockResolvedValue(updatedCategory);

      const result = await controller.update(1, updateDto);

      expect(service.updateDto).toHaveBeenCalledWith(1, updateDto);
      expect(result).toEqual(updatedCategory);
    });

    it('should handle partial updates', async () => {
      const updateDto: UpdatePromptCategoryDto = {
        name: 'Updated Name Only',
      };

      const updatedCategory = {
        ...mockCategory,
        name: 'Updated Name Only',
      };

      mockPromptCategoriesService.updateDto.mockResolvedValue(updatedCategory);

      const result = await controller.update(1, updateDto);

      expect(service.updateDto).toHaveBeenCalledWith(1, updateDto);
      expect(result).toEqual(updatedCategory);
    });

    it('should handle service errors during update', async () => {
      const updateDto: UpdatePromptCategoryDto = {
        name: 'Updated Category',
      };

      mockPromptCategoriesService.updateDto.mockRejectedValue(new NotFoundException('Category not found'));

      await expect(controller.update(999, updateDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete a category successfully', async () => {
      mockPromptCategoriesService.delete.mockResolvedValue(undefined);

      const result = await controller.delete(1);

      expect(service.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual({ message: 'Category deleted successfully' });
    });

    it('should handle service errors during deletion', async () => {
      mockPromptCategoriesService.delete.mockRejectedValue(new NotFoundException('Category not found'));

      await expect(controller.delete(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('error handling', () => {
    it('should propagate service exceptions', async () => {
      mockPromptCategoriesService.findOneDto.mockRejectedValue(new Error('Database error'));

      await expect(controller.findOne(1)).rejects.toThrow('Database error');
    });

    it('should handle unexpected errors gracefully', async () => {
      const createDto: CreatePromptCategoryDto = {
        name: 'Test Category',
      };

      mockPromptCategoriesService.createDto.mockRejectedValue(new Error('Unexpected error'));

      await expect(controller.create(createDto)).rejects.toThrow('Unexpected error');
    });
  });

  describe('input validation', () => {
    it('should handle empty update DTOs', async () => {
      const updateDto: UpdatePromptCategoryDto = {};

      mockPromptCategoriesService.updateDto.mockResolvedValue(mockCategory);

      const result = await controller.update(1, updateDto);

      expect(service.updateDto).toHaveBeenCalledWith(1, updateDto);
      expect(result).toBeDefined();
    });
  });
});
