import { Badge, Group, Modal, ScrollArea, Tabs, Text } from '@mantine/core';
import { IconEye, IconHistory, IconStar } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useApi } from 'src/api';
import { PromptResponseDto, PromptVersionResponseDto } from 'src/api/generated/models';
import { texts } from 'src/texts';
import { PromptDetailsSection } from './PromptDetailsSection';
import { PromptRatingSection } from './PromptRatingSection';
import { PromptVersionSection } from './PromptVersionSection';

interface PromptDetailsModalProps {
  opened: boolean;
  onClose: () => void;
  promptId: number | null;
  onPromptSelect?: (prompt: PromptResponseDto) => void;
}

export function PromptDetailsModal({ opened, onClose, promptId, onPromptSelect }: PromptDetailsModalProps) {
  const api = useApi();
  const [selectedVersion, setSelectedVersion] = useState<PromptVersionResponseDto | null>(null);

  // Fetch prompt details
  const {
    data: prompt,
    isLoading: promptLoading,
    error: _promptError,
  } = useQuery({
    queryKey: ['prompt', promptId],
    queryFn: async () => {
      if (!promptId) return null;
      console.log('Fetching prompt details for ID:', promptId);
      try {
        const result = await api.prompts.promptsControllerFindOne(promptId);
        console.log('Prompt details loaded:', result);
        return result;
      } catch (error) {
        console.error('Error fetching prompt details:', error);
        throw error;
      }
    },
    enabled: !!promptId && opened,
    retry: false,
  });

  // Fetch versions
  const { data: versions = [] } = useQuery({
    queryKey: ['prompt-versions', promptId],
    queryFn: () => (promptId ? api.prompts.promptsControllerGetVersions(promptId) : []),
    enabled: !!promptId && opened,
    retry: false,
  });

  const handleVersionSelect = (version: PromptVersionResponseDto) => {
    setSelectedVersion(version);
  };

  if (!opened || !promptId) {
    return null;
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="sm">
          <Text size="lg" fw={600}>
            Prompt Details
          </Text>
          {prompt?.category && (
            <Badge size="sm" variant="light" color={prompt.category.color || 'blue'}>
              {prompt.category.name}
            </Badge>
          )}
        </Group>
      }
      size="xl"
      scrollAreaComponent={ScrollArea.Autosize}
    >
      {promptLoading ? (
        <Text ta="center" py="xl">
          {texts.chat.prompts.messages.loading}
        </Text>
      ) : !prompt ? (
        <Text ta="center" py="xl" c="red">
          {texts.chat.prompts.messages.notFound}
        </Text>
      ) : (
        <Tabs defaultValue="details" variant="outline">
          <Tabs.List>
            <Tabs.Tab value="details" leftSection={<IconEye size={16} />}>
              {texts.chat.prompts.tabs.details}
            </Tabs.Tab>
            <Tabs.Tab value="versions" leftSection={<IconHistory size={16} />}>
              {texts.chat.prompts.tabs.versions} ({versions.length})
            </Tabs.Tab>
            <Tabs.Tab value="ratings" leftSection={<IconStar size={16} />}>
              {texts.chat.prompts.tabs.ratings} ({prompt.ratingCount || 0})
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="details" pt="md">
            <PromptDetailsSection
              prompt={prompt}
              selectedVersionContent={selectedVersion?.content}
              onPromptSelect={onPromptSelect}
              onClose={onClose}
            />
          </Tabs.Panel>

          <Tabs.Panel value="versions" pt="md">
            <PromptVersionSection promptId={promptId} onVersionSelect={handleVersionSelect} />
          </Tabs.Panel>

          <Tabs.Panel value="ratings" pt="md">
            <PromptRatingSection
              promptId={promptId}
              averageRating={Number(prompt.averageRating) || 0}
              ratingCount={prompt.ratingCount || 0}
            />
          </Tabs.Panel>
        </Tabs>
      )}
    </Modal>
  );
}
