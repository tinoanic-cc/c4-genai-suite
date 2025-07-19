import { Box, ScrollArea, SimpleGrid, Text } from '@mantine/core';
import { PromptResponseDto } from 'src/api/generated/models';
import { texts } from 'src/texts';
import { PromptCard } from './PromptCard';

interface PromptGridProps {
  prompts: PromptResponseDto[];
  isLoading: boolean;
  onPromptUse: (prompt: PromptResponseDto) => void;
  onShowDetails: (promptId: number) => void;
}

export function PromptGrid({ prompts, isLoading, onPromptUse, onShowDetails }: PromptGridProps) {
  if (isLoading) {
    return (
      <ScrollArea className="flex-1 p-6">
        <Text size="sm" c="dimmed" ta="center" py="xl">
          {texts.chat.prompts.messages.loading}
        </Text>
      </ScrollArea>
    );
  }

  if (prompts.length === 0) {
    return (
      <ScrollArea className="flex-1 p-6">
        <Box ta="center" py="xl">
          <Text size="sm" c="dimmed" mb="xs">
            {texts.chat.prompts.noResults}
          </Text>
          <Text size="xs" c="dimmed">
            {texts.chat.prompts.noResultsHint}
          </Text>
        </Box>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea className="flex-1 p-6">
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
        {prompts.map((prompt) => (
          <PromptCard key={prompt.id} prompt={prompt} onUse={onPromptUse} onShowDetails={onShowDetails} />
        ))}
      </SimpleGrid>
    </ScrollArea>
  );
}
