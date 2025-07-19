import { Accordion, Button, Select, Slider, Stack, Text, TextInput, Tooltip } from '@mantine/core';
import { IconChevronDown, IconPlus, IconSearch } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useApi } from 'src/api';
import { ProfileButton } from 'src/components';
import { texts } from 'src/texts';
import { useStateMutateRemoveAllChats } from '../state/listOfChats';

interface PromptSidebarProps {
  onCreatePrompt: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  minRating: number;
  setMinRating: (rating: number) => void;
  sortBy: string;
  setSortBy: (sortBy: string) => void;
}

export function PromptSidebar({
  onCreatePrompt,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  minRating,
  setMinRating,
  sortBy,
  setSortBy,
}: PromptSidebarProps) {
  const removeAllChats = useStateMutateRemoveAllChats();
  const api = useApi();

  // Fetch categories with counts from real API
  const { data: categories = [] } = useQuery({
    queryKey: ['prompt-categories-with-counts'],
    queryFn: async () => {
      try {
        const result = await api.promptCategories.promptCategoriesControllerFindAllWithCounts();
        return result;
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        // Fallback to mock data if API fails
        return [
          { id: 1, name: 'Code Review', promptCount: 5, color: '#3B82F6', createdAt: '', updatedAt: '' },
          { id: 2, name: 'Documentation', promptCount: 3, color: '#10B981', createdAt: '', updatedAt: '' },
          { id: 3, name: 'Testing', promptCount: 2, color: '#F59E0B', createdAt: '', updatedAt: '' },
        ];
      }
    },
  });

  // Fetch prompts for count
  const { data: _promptsData } = useQuery({
    queryKey: ['prompts', searchTerm, selectedCategory, sortBy],
    queryFn: () => {
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

      const { sortBy: _apiSortBy, sortOrder: _sortOrder } = getSortParams(sortBy);

      // Temporarily return empty response until API is fully implemented
      return Promise.resolve({ items: [], total: 0, page: 1, limit: 12 });
    },
  });

  // Fetch total count for "All" category - temporarily return empty response
  const { data: allPromptsData } = useQuery({
    queryKey: ['prompts-all-count'],
    queryFn: () => Promise.resolve({ items: [], total: 0, page: 1, limit: 1 }),
  });

  // Category tabs data
  const categoryTabs = [
    { value: 'all', label: texts.chat.prompts.categories.all, count: allPromptsData?.total || 0 },
    ...categories.map((cat) => ({
      value: cat.id.toString(),
      label: cat.name,
      count: cat.promptCount || 0,
    })),
  ];

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header - Optimized */}
      <div className="border-b border-gray-200 bg-white p-4">
        <Text size="xl" fw={700} mb="md" className="text-gray-900">
          {texts.chat.prompts.library}
        </Text>

        {/* Primary Action Button - More prominent */}
        <Tooltip label={texts.chat.prompts.tooltips.createNew} position="top" withArrow>
          <Button
            leftSection={<IconPlus size={18} />}
            onClick={onCreatePrompt}
            fullWidth
            size="md"
            className="mb-4 bg-blue-600 hover:bg-blue-700"
            radius="md"
          >
            {texts.chat.prompts.newPrompt}
          </Button>
        </Tooltip>

        {/* Enhanced Search */}
        <div className="relative">
          <TextInput
            placeholder={texts.chat.prompts.searchPlaceholder}
            leftSection={<IconSearch size={18} className="text-gray-400" />}
            rightSection={
              searchTerm && (
                <button
                  onClick={clearSearch}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-gray-500 hover:bg-gray-300 hover:text-gray-700"
                  type="button"
                >
                  ×
                </button>
              )
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="md"
            radius="md"
            className="w-full"
            styles={{
              input: {
                fontSize: '14px',
                padding: '12px 16px',
                paddingLeft: '44px',
                paddingRight: searchTerm ? '44px' : '16px',
              },
            }}
          />
        </div>
      </div>

      {/* Filter Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Category Dropdown */}
        <div className="mb-6">
          <Text size="sm" fw={600} mb="sm">
            Kategorien
          </Text>
          <Select
            placeholder={texts.chat.prompts.categories.all}
            value={selectedCategory}
            onChange={setSelectedCategory}
            data={categoryTabs.map((tab) => ({
              value: tab.value,
              label: `${tab.label} (${tab.count})`,
            }))}
            rightSection={<IconChevronDown size={16} />}
            size="sm"
            radius="md"
            searchable
            clearable
            maxDropdownHeight={200}
            styles={{
              input: {
                fontSize: '14px',
              },
            }}
          />
        </div>

        {/* Collapsible Filter Sections */}
        <Accordion
          multiple
          defaultValue={['rating', 'sorting']}
          styles={{
            item: {
              border: 'none',
              marginBottom: '16px',
            },
            control: {
              padding: '8px 0',
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: '14px',
              fontWeight: 600,
            },
            content: {
              padding: '12px 0 0 0',
            },
            chevron: {
              width: '16px',
              height: '16px',
            },
          }}
        >
          {/* Rating Section */}
          <Accordion.Item value="rating">
            <Accordion.Control>{texts.chat.prompts.rating}</Accordion.Control>
            <Accordion.Panel>
              <Text size="xs" c="dimmed" mb="xs">
                Mindestbewertung: {minRating.toFixed(1)}
              </Text>
              <Slider
                value={minRating}
                onChange={setMinRating}
                min={0}
                max={5}
                step={0.1}
                size="sm"
                color="blue"
                marks={[
                  { value: 0, label: '0' },
                  { value: 2.5, label: '2.5' },
                  { value: 5, label: '5' },
                ]}
                styles={{
                  mark: {
                    fontSize: '11px',
                    color: '#6b7280',
                  },
                  markLabel: {
                    fontSize: '11px',
                    color: '#6b7280',
                  },
                }}
                mb="sm"
              />
            </Accordion.Panel>
          </Accordion.Item>

          {/* Sorting Section */}
          <Accordion.Item value="sorting">
            <Accordion.Control>{texts.chat.prompts.sorting}</Accordion.Control>
            <Accordion.Panel>
              <Stack gap="xs">
                <label className="flex items-center gap-2">
                  <input type="radio" name="sort" checked={sortBy === 'newest'} onChange={() => setSortBy('newest')} />
                  <Text size="sm">{texts.chat.prompts.newestFirst}</Text>
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="sort" checked={sortBy === 'rating'} onChange={() => setSortBy('rating')} />
                  <Text size="sm">{texts.chat.prompts.bestRating}</Text>
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="sort" checked={sortBy === 'usage'} onChange={() => setSortBy('usage')} />
                  <Text size="sm">{texts.chat.prompts.mostUsed}</Text>
                </label>
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </div>

      {/* Profile Button at the bottom */}
      <div className="p-2" onClick={(e) => e.stopPropagation()}>
        <ProfileButton section="chat" onClearConversations={removeAllChats.mutate} />
      </div>
    </div>
  );
}
