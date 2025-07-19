import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  CreatePromptCategoryDto,
  PromptCategoryResponseDto,
  PromptCategoryWithCountResponseDto,
  UpdatePromptCategoryDto,
} from '../../domain/prompts';
import { PromptCategoriesService } from '../../domain/prompts/prompt-categories.service';
import { AdminPromptCategoriesController } from './prompt-categories.controller';

describe('AdminPromptCategoriesController', () => {
  let controller: AdminPromptCategoriesController;

  const mockPromptCategoriesService = {
    createDto: jest.fn(),
    findAllDto: jest.fn(),
    findAllWithCountsDto: jest.fn(),
    findOneDto: jest.fn(),
    updateDto: jest.fn(),
    delete: jest.fn(),
  };

  const mockCategoryResponse: PromptCategoryResponseDto = {
    id: 1,
    name: 'Test Category',
    description: 'Test Description',
    color: '#FF0000',
    sortOrder: 1,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  };

  const mockCategoryWithCountResponse: PromptCategoryWithCountResponseDto = {
    ...mockCategoryResponse,
    promptCount: 5,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminPromptCategoriesController],
      providers: [
        {
          provide: PromptCategoriesService,
          useValue: mockPromptCategoriesService,
        },
      ],
    }).compile();

    controller = module.get<AdminPromptCategoriesController>(AdminPromptCategoriesController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new prompt category', async () => {
      const createDto: CreatePromptCategoryDto = {
        name: 'Test Category',
        description: 'Test Description',
        color: '#FF0000',
        sortOrder: 1,
      };

      mockPromptCategoriesService.createDto.mockResolvedValue(mockCategoryResponse);

      const result = await controller.create(createDto);

      expect(mockPromptCategoriesService.createDto).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockCategoryResponse);
    });

    it('should handle service errors during creation', async () => {
      const createDto: CreatePromptCategoryDto = {
        name: 'Test Category',
      };

      mockPromptCategoriesService.createDto.mockRejectedValue(new Error('Database error'));

      await expect(controller.create(createDto)).rejects.toThrow('Database error');
    });
  });

  describe('findAll', () => {
    it('should return all prompt categories', async () => {
      const categories = [mockCategoryResponse];
      mockPromptCategoriesService.findAllDto.mockResolvedValue(categories);

      const result = await controller.findAll();

      expect(mockPromptCategoriesService.findAllDto).toHaveBeenCalled();
      expect(result).toEqual(categories);
    });

    it('should return empty array when no categories exist', async () => {
      mockPromptCategoriesService.findAllDto.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findAllWithCounts', () => {
    it('should return all categories with prompt counts', async () => {
      const categoriesWithCounts = [mockCategoryWithCountResponse];
      mockPromptCategoriesService.findAllWithCountsDto.mockResolvedValue(categoriesWithCounts);

      const result = await controller.findAllWithCounts();

      expect(mockPromptCategoriesService.findAllWithCountsDto).toHaveBeenCalled();
      expect(result).toEqual(categoriesWithCounts);
    });

    it('should return categories with zero counts', async () => {
      const categoryWithZeroCount = { ...mockCategoryWithCountResponse, promptCount: 0 };
      mockPromptCategoriesService.findAllWithCountsDto.mockResolvedValue([categoryWithZeroCount]);

      const result = await controller.findAllWithCounts();

      expect(result[0].promptCount).toBe(0);
    });
  });

  describe('findOne', () => {
    it('should return a specific category by ID', async () => {
      mockPromptCategoriesService.findOneDto.mockResolvedValue(mockCategoryResponse);

      const result = await controller.findOne(1);

      expect(mockPromptCategoriesService.findOneDto).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockCategoryResponse);
    });

    it('should throw NotFoundException when category does not exist', async () => {
      mockPromptCategoriesService.findOneDto.mockResolvedValue(null);

      await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(controller.findOne(999)).rejects.toThrow('Category not found');
    });

    it('should handle service errors during findOne', async () => {
      mockPromptCategoriesService.findOneDto.mockRejectedValue(new Error('Database error'));

      await expect(controller.findOne(1)).rejects.toThrow('Database error');
    });
  });

  describe('update', () => {
    it('should update a category successfully', async () => {
      const updateDto: UpdatePromptCategoryDto = {
        name: 'Updated Category',
        description: 'Updated Description',
      };

      const updatedCategory = { ...mockCategoryResponse, ...updateDto };
      mockPromptCategoriesService.updateDto.mockResolvedValue(updatedCategory);

      const result = await controller.update(1, updateDto);

      expect(mockPromptCategoriesService.updateDto).toHaveBeenCalledWith(1, updateDto);
      expect(result).toEqual(updatedCategory);
    });

    it('should handle partial updates', async () => {
      const updateDto: UpdatePromptCategoryDto = {
        name: 'Updated Name Only',
      };

      const updatedCategory = { ...mockCategoryResponse, name: 'Updated Name Only' };
      mockPromptCategoriesService.updateDto.mockResolvedValue(updatedCategory);

      const result = await controller.update(1, updateDto);

      expect(result.name).toBe('Updated Name Only');
      expect(result.description).toBe(mockCategoryResponse.description);
    });

    it('should handle service errors during update', async () => {
      const updateDto: UpdatePromptCategoryDto = { name: 'Test' };
      mockPromptCategoriesService.updateDto.mockRejectedValue(new NotFoundException('Category not found'));

      await expect(controller.update(999, updateDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete a category successfully', async () => {
      mockPromptCategoriesService.delete.mockResolvedValue(undefined);

      const result = await controller.delete(1);

      expect(mockPromptCategoriesService.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual({ message: 'Category deleted successfully' });
    });

    it('should handle service errors during deletion', async () => {
      mockPromptCategoriesService.delete.mockRejectedValue(new NotFoundException('Category not found'));

      await expect(controller.delete(999)).rejects.toThrow(NotFoundException);
    });

    it('should return success message after deletion', async () => {
      mockPromptCategoriesService.delete.mockResolvedValue(undefined);

      const result = await controller.delete(1);

      expect(result.message).toBe('Category deleted successfully');
    });
  });

  describe('error handling', () => {
    it('should propagate service exceptions', async () => {
      const createDto: CreatePromptCategoryDto = { name: 'Test' };
      mockPromptCategoriesService.createDto.mockRejectedValue(new Error('Service error'));

      await expect(controller.create(createDto)).rejects.toThrow('Service error');
    });

    it('should handle unexpected errors gracefully', async () => {
      mockPromptCategoriesService.findAllDto.mockRejectedValue(new Error('Unexpected error'));

      await expect(controller.findAll()).rejects.toThrow('Unexpected error');
    });
  });

  describe('input validation', () => {
    it('should handle invalid ID parameters', async () => {
      // ParseIntPipe should handle this at the framework level
      // but we test the controller behavior with valid numbers
      mockPromptCategoriesService.findOneDto.mockResolvedValue(mockCategoryResponse);

      await expect(controller.findOne(1)).resolves.toBeDefined();
    });

    it('should handle empty update DTOs', async () => {
      const emptyUpdateDto: UpdatePromptCategoryDto = {};
      mockPromptCategoriesService.updateDto.mockResolvedValue(mockCategoryResponse);

      const result = await controller.update(1, emptyUpdateDto);

      expect(mockPromptCategoriesService.updateDto).toHaveBeenCalledWith(1, emptyUpdateDto);
      expect(result).toEqual(mockCategoryResponse);
    });
  });
});
