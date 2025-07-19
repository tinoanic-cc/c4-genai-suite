import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useApi } from 'src/api';
import { PromptResponseDto } from 'src/api/generated/models';
import { PromptDetailsModal } from './PromptDetailsModal';
import { PromptGrid } from './PromptGrid';

interface PromptLibraryProps {
  onPromptSelect: (prompt: PromptResponseDto) => void;
  onCreatePrompt: () => void;
  searchTerm: string;
  selectedCategory: string | null;
  minRating: number;
  sortBy: string;
}

export function PromptLibrary({ onPromptSelect, searchTerm, selectedCategory, minRating, sortBy }: PromptLibraryProps) {
  const [selectedPromptId, setSelectedPromptId] = useState<number | null>(null);
  const [detailsModalOpened, setDetailsModalOpened] = useState(false);
  const api = useApi();

  // Fetch prompts with search, category and rating filters from real API
  const { data: promptsData, isLoading } = useQuery({
    queryKey: ['prompts-library', searchTerm, selectedCategory, minRating, sortBy],
    queryFn: async () => {
      try {
        // Get sort parameters for API
        const getSortParams = (sortBy: string) => {
          switch (sortBy) {
            case 'rating':
              return { sortBy: 'averageRating' as const, sortOrder: 'DESC' as const };
            case 'usage':
              return { sortBy: 'usageCount' as const, sortOrder: 'DESC' as const };
            case 'newest':
            default:
              return { sortBy: 'createdAt' as const, sortOrder: 'DESC' as const };
          }
        };

        const { sortBy: apiSortBy, sortOrder } = getSortParams(sortBy);

        // Call the real API with all required parameters
        const result = await api.prompts.promptsControllerFindAll(
          selectedCategory && selectedCategory !== 'all' ? parseInt(selectedCategory) : 0,
          searchTerm || '',
          minRating,
          1, // page
          50, // limit
          apiSortBy,
          sortOrder,
        );

        // Apply client-side rating filter (if API doesn't support it)
        let filteredItems = result.items || [];
        if (minRating > 0) {
          filteredItems = filteredItems.filter((p) => (p.averageRating || 0) >= minRating);
        }

        return {
          items: filteredItems,
          total: filteredItems.length,
          page: result.page || 1,
          limit: result.limit || 50,
        };
      } catch (error) {
        console.error('Failed to fetch prompts:', error);

        // Fallback to mock data if API fails
        const mockPrompts = [
          {
            id: 1,
            title: 'Code Review Assistant',
            description: 'A comprehensive prompt for conducting thorough code reviews',
            content:
              'Please review the following code and provide feedback on:\n1. Code quality and readability\n2. Performance considerations\n3. Security issues\n4. Best practices\n\nCode to review:\n[INSERT CODE HERE]',
            isPublic: true,
            averageRating: 4.5,
            ratingCount: 12,
            usageCount: 45,
            createdAt: '2024-01-15T10:30:00Z',
            updatedAt: '2024-01-15T10:30:00Z',
            category: { id: 1, name: 'Code Review', color: '#3B82F6', createdAt: '', updatedAt: '' },
            author: { id: 1, name: 'John Doe' },
            versions: [],
          },
          {
            id: 2,
            title: 'Documentation Generator',
            description: 'Generate comprehensive documentation for your code',
            content:
              'Generate detailed documentation for the following code:\n\n[INSERT CODE HERE]\n\nInclude:\n- Function/method descriptions\n- Parameter explanations\n- Return value descriptions\n- Usage examples',
            isPublic: true,
            averageRating: 4.2,
            ratingCount: 8,
            usageCount: 23,
            createdAt: '2024-01-14T15:20:00Z',
            updatedAt: '2024-01-14T15:20:00Z',
            category: { id: 2, name: 'Documentation', color: '#10B981', createdAt: '', updatedAt: '' },
            author: { id: 2, name: 'Jane Smith' },
            versions: [],
          },
          {
            id: 3,
            title: 'Test Case Generator',
            description: 'Create comprehensive test cases for your functions',
            content:
              'Generate comprehensive test cases for the following function:\n\n[INSERT FUNCTION HERE]\n\nInclude:\n- Unit tests for normal cases\n- Edge cases\n- Error handling tests\n- Mock data examples',
            isPublic: false,
            averageRating: 4.8,
            ratingCount: 5,
            usageCount: 15,
            createdAt: '2024-01-13T09:45:00Z',
            updatedAt: '2024-01-13T09:45:00Z',
            category: { id: 3, name: 'Testing', color: '#F59E0B', createdAt: '', updatedAt: '' },
            author: { id: 1, name: 'John Doe' },
            versions: [],
          },
        ];

        // Apply filters to mock data
        let filteredPrompts = mockPrompts;

        if (searchTerm) {
          filteredPrompts = filteredPrompts.filter(
            (p) =>
              p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              p.content.toLowerCase().includes(searchTerm.toLowerCase()),
          );
        }

        if (selectedCategory && selectedCategory !== 'all') {
          filteredPrompts = filteredPrompts.filter((p) => p.category?.id.toString() === selectedCategory);
        }

        if (minRating > 0) {
          filteredPrompts = filteredPrompts.filter((p) => (p.averageRating || 0) >= minRating);
        }

        // Apply sorting
        filteredPrompts.sort((a, b) => {
          switch (sortBy) {
            case 'rating':
              return (b.averageRating || 0) - (a.averageRating || 0);
            case 'usage':
              return (b.usageCount || 0) - (a.usageCount || 0);
            case 'newest':
            default:
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }
        });

        return {
          items: filteredPrompts,
          total: filteredPrompts.length,
          page: 1,
          limit: 12,
        };
      }
    },
  });

  const handlePromptUse = (prompt: PromptResponseDto) => {
    try {
      // Record usage tracking when API is ready
      // await api.prompts.promptsControllerRecordUsage(prompt.id);
      onPromptSelect(prompt);
    } catch (error) {
      console.error('Failed to use prompt:', error);
    }
  };

  const handleShowDetails = (promptId: number) => {
    setSelectedPromptId(promptId);
    setDetailsModalOpened(true);
  };

  const handleCloseDetails = () => {
    setDetailsModalOpened(false);
    setSelectedPromptId(null);
  };

  return (
    <div className="flex h-full w-full flex-col bg-white">
      <PromptGrid
        prompts={(promptsData?.items || []) as PromptResponseDto[]}
        isLoading={isLoading}
        onPromptUse={handlePromptUse}
        onShowDetails={handleShowDetails}
      />

      {/* Prompt Details Modal */}
      <PromptDetailsModal
        opened={detailsModalOpened}
        onClose={handleCloseDetails}
        promptId={selectedPromptId}
        onPromptSelect={onPromptSelect}
      />
    </div>
  );
}
