import { Badge, Box, Button, Card, Group, Rating, ScrollArea, SimpleGrid, Text, Tooltip } from '@mantine/core';
import { IconEye, IconLock, IconPlayerPlay, IconWorld } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { PromptResponseDto } from 'src/api/generated';
import { texts } from 'src/texts';
import { PromptDetailsModal } from './PromptDetailsModal';

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

  // Fetch prompts with search, category and rating filters
  const { data: promptsData, isLoading } = useQuery<{ items: PromptResponseDto[]; total: number }>({
    queryKey: ['prompts-library', searchTerm, selectedCategory, minRating, sortBy],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory && selectedCategory !== 'all') params.append('categoryId', selectedCategory);
      if (minRating > 0) params.append('minRating', minRating.toString());
      params.append('page', '1');
      params.append('limit', '50');

      // Set sort parameters
      switch (sortBy) {
        case 'rating':
          params.append('sortBy', 'averageRating');
          params.append('sortOrder', 'DESC');
          break;
        case 'usage':
          params.append('sortBy', 'usageCount');
          params.append('sortOrder', 'DESC');
          break;
        case 'newest':
        default:
          params.append('sortBy', 'createdAt');
          params.append('sortOrder', 'DESC');
          break;
      }

      const response = await fetch(`/api/prompts?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch prompts');
      }
      const result: unknown = await response.json();
      return result as { items: PromptResponseDto[]; total: number };
    },
  });

  // Utility function to get prompt preview
  const getPromptPreview = (content: string, maxLength: number = 150): string => {
    if (!content) return '';
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + '...';
  };

  const handlePromptUse = async (prompt: PromptResponseDto) => {
    try {
      await fetch(`/api/prompts/${prompt.id}/use`, { method: 'POST' });
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
      <ScrollArea className="flex-1 p-6">
        {isLoading ? (
          <Text size="sm" c="dimmed" ta="center" py="xl">
            {texts.chat.prompts.messages.loading}
          </Text>
        ) : !promptsData?.items || promptsData.items.length === 0 ? (
          <Box ta="center" py="xl">
            <Text size="sm" c="dimmed" mb="xs">
              {texts.chat.prompts.noResults}
            </Text>
            <Text size="xs" c="dimmed">
              {texts.chat.prompts.noResultsHint}
            </Text>
          </Box>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
            {promptsData.items.map((prompt) => (
              <Card
                key={prompt.id}
                p="lg"
                withBorder
                className="flex h-full min-h-[320px] flex-col transition-shadow hover:shadow-lg"
                style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
              >
                {/* Header */}
                <div className="mb-4">
                  <Group justify="space-between" align="flex-start" mb="sm">
                    <div className="min-w-0 flex-1">
                      <Text size="sm" fw={600} mb="xs" lineClamp={2} className="min-h-[2.5rem]">
                        {prompt.title}
                      </Text>
                      <div className="min-h-[2rem]">
                        {prompt.description && (
                          <Text size="xs" c="dimmed" lineClamp={2} mb="xs">
                            {prompt.description}
                          </Text>
                        )}
                      </div>
                      <Group gap="xs" mt="xs">
                        {prompt.category && (
                          <Badge size="xs" variant="light" color={(prompt.category as { color?: string })?.color || 'blue'}>
                            {(prompt.category as { name?: string })?.name}
                          </Badge>
                        )}
                        <Badge
                          size="xs"
                          variant="light"
                          color={prompt.isPublic ? 'green' : 'gray'}
                          leftSection={prompt.isPublic ? <IconWorld size={10} /> : <IconLock size={10} />}
                        >
                          {prompt.isPublic ? texts.common.public : texts.common.private}
                        </Badge>
                      </Group>
                    </div>
                  </Group>
                </div>

                {/* Content */}
                <div className="mb-4 flex-1">
                  {prompt.content && (
                    <Box p="xs" className="rounded border-l-2 border-blue-200 bg-gray-50">
                      <Text size="xs" c="dimmed" mb="xs" fw={500}>
                        {texts.common.text}:
                      </Text>
                      <Text size="xs" c="dark" lineClamp={4} className="font-mono">
                        {getPromptPreview(prompt.content, 200)}
                      </Text>
                    </Box>
                  )}
                </div>

                {/* Footer */}
                <div className="mt-auto">
                  {/* Stats */}
                  <Group justify="space-between" align="center" mb="sm">
                    <Group gap="xs">
                      <Tooltip
                        label={`Rating: ${(Number(prompt.averageRating) || 0).toFixed(1)} (${prompt.ratingCount || 0} ratings)`}
                        position="top"
                        withArrow
                      >
                        <Group gap={2}>
                          <Rating value={prompt.averageRating || 0} readOnly size="xs" />
                        </Group>
                      </Tooltip>
                      <Tooltip label="Usage count" position="top" withArrow>
                        <Group gap={2}>
                          <IconEye size={12} className="text-gray-500" />
                          <Text size="xs" c="dimmed">
                            {prompt.usageCount || 0}
                          </Text>
                        </Group>
                      </Tooltip>
                    </Group>
                  </Group>

                  {/* Author and Date */}
                  <Group justify="space-between" align="center" mb="md">
                    <Text size="xs" c="dimmed">
                      {(prompt.author as { name?: string })?.name || 'Unknown'}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {new Date(prompt.createdAt).toLocaleDateString('de-DE')}
                    </Text>
                  </Group>

                  {/* Actions */}
                  <Group gap="xs">
                    <Tooltip label="Show details" position="top" withArrow>
                      <Button
                        variant="light"
                        size="sm"
                        leftSection={<IconEye size={14} />}
                        flex={1}
                        onClick={() => handleShowDetails(prompt.id)}
                      >
                        Details
                      </Button>
                    </Tooltip>
                    <Tooltip label="Use in chat" position="top" withArrow>
                      <Button
                        size="sm"
                        leftSection={<IconPlayerPlay size={14} />}
                        flex={1}
                        onClick={() => handlePromptUse(prompt)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Use
                      </Button>
                    </Tooltip>
                  </Group>
                </div>
              </Card>
            ))}
          </SimpleGrid>
        )}
      </ScrollArea>

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

// Simplified sidebar component
export function PromptSidebar() {
  return (
    <div className="flex h-full flex-col p-4">
      <Text size="xl" fw={700} mb="md" className="text-gray-900">
        {texts.chat.prompts.library}
      </Text>
      <Text size="sm" c="dimmed">
        Simplified sidebar - filters will be added later
      </Text>
    </div>
  );
}
