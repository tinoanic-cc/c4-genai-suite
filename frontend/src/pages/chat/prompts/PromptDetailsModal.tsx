import { Badge, Button, Card, Divider, Group, Modal, Rating, ScrollArea, Stack, Text, Tooltip } from '@mantine/core';
import { IconCalendar, IconCopy as IconClone, IconCopy, IconEye, IconPlayerPlay, IconUser } from '@tabler/icons-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { PromptResponseDto } from 'src/api/generated';
import { texts } from 'src/texts';

interface PromptDetailsModalProps {
  opened: boolean;
  onClose: () => void;
  promptId: number | null;
  onPromptSelect?: (prompt: PromptResponseDto) => void;
}

export function PromptDetailsModal({ opened, onClose, promptId, onPromptSelect }: PromptDetailsModalProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch prompt details
  const { data: prompt, isLoading: promptLoading } = useQuery<PromptResponseDto>({
    queryKey: ['prompt', promptId],
    queryFn: async (): Promise<PromptResponseDto> => {
      if (!promptId) throw new Error('No prompt ID provided');
      const response = await fetch(`/api/prompts/${promptId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch prompt');
      }
      return response.json() as Promise<PromptResponseDto>;
    },
    enabled: !!promptId && opened,
    retry: false,
  });

  // Use prompt mutation
  const usePromptMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/prompts/${id}/use`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to record prompt usage');
      }
    },
    onSuccess: () => {
      if (prompt && onPromptSelect) {
        onPromptSelect(prompt);
        onClose();
      }
      void queryClient.invalidateQueries({
        predicate: (query) => {
          const key = query.queryKey[0];
          return key === 'prompts' || key === 'prompts-library';
        },
      });
    },
    onError: () => {
      toast.error('Fehler beim Verwenden des Prompts');
    },
  });

  // Clone prompt mutation
  const clonePromptMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/prompts/${id}/clone`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to clone prompt');
      }
    },
    onSuccess: () => {
      toast.success('Prompt erfolgreich geklont!');
      void queryClient.invalidateQueries({
        predicate: (query) => {
          const key = query.queryKey[0];
          return key === 'prompts' || key === 'prompts-library';
        },
      });
    },
    onError: () => {
      toast.error('Fehler beim Klonen des Prompts');
    },
  });

  // Event handlers
  const handleUsePrompt = () => {
    if (prompt?.content) {
      void navigate('/chat/new', { state: { initialPrompt: prompt.content } });
      onClose();
    }
  };

  const handleClonePrompt = () => {
    if (promptId) {
      clonePromptMutation.mutate(promptId);
    }
  };

  const handleCopyPrompt = async () => {
    if (prompt?.content) {
      try {
        await navigator.clipboard.writeText(prompt.content);
        toast.success('Prompt in Zwischenablage kopiert!');
      } catch {
        toast.error('Fehler beim Kopieren');
      }
    }
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
        <Stack gap="lg">
          {/* Header */}
          <div>
            <Text size="xl" fw={700} mb="xs">
              {prompt.title}
            </Text>
            {prompt.description && (
              <Text size="sm" c="dimmed" mb="sm">
                {prompt.description}
              </Text>
            )}
          </div>

          {/* Stats */}
          <Group gap="xl">
            <Group gap="xs">
              <Rating value={prompt.averageRating || 0} readOnly size="sm" />
              <Text size="sm" c="dimmed">
                {(Number(prompt.averageRating) || 0).toFixed(1)} ({prompt.ratingCount || 0} ratings)
              </Text>
            </Group>
            <Group gap="xs">
              <IconEye size={16} className="text-gray-500" />
              <Text size="sm" c="dimmed">
                {prompt.usageCount || 0} uses
              </Text>
            </Group>
          </Group>

          {/* Author and Date */}
          <Group gap="xl">
            <Group gap="xs">
              <IconUser size={16} className="text-gray-500" />
              <Text size="sm">{(prompt.author as { name?: string })?.name || 'Unknown'}</Text>
            </Group>
            <Group gap="xs">
              <IconCalendar size={16} className="text-gray-500" />
              <Text size="sm" c="dimmed">
                {new Date(prompt.createdAt).toLocaleDateString('de-DE')}
              </Text>
            </Group>
          </Group>

          <Divider />

          {/* Prompt Content */}
          <div>
            <Text size="sm" fw={600} mb="sm">
              Content
            </Text>
            <Card withBorder p="md" className="bg-gray-50">
              <div style={{ maxHeight: 300, overflow: 'auto' }}>
                <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
                  {prompt.content}
                </Text>
              </div>
            </Card>
          </div>

          {/* Actions */}
          <Group gap="sm">
            <Tooltip label="Use in chat" position="top" withArrow>
              <Button
                leftSection={<IconPlayerPlay size={16} />}
                onClick={handleUsePrompt}
                loading={usePromptMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Use
              </Button>
            </Tooltip>
            <Tooltip label="Clone prompt" position="top" withArrow>
              <Button
                variant="light"
                leftSection={<IconClone size={16} />}
                onClick={handleClonePrompt}
                loading={clonePromptMutation.isPending}
              >
                Clone
              </Button>
            </Tooltip>
            <Tooltip label="Copy to clipboard" position="top" withArrow>
              <Button variant="light" leftSection={<IconCopy size={16} />} onClick={handleCopyPrompt}>
                Copy
              </Button>
            </Tooltip>
          </Group>
        </Stack>
      )}
    </Modal>
  );
}
