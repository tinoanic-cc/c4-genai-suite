import {
  ActionIcon,
  Button,
  Card,
  Divider,
  Group,
  Rating,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
  Tooltip,
} from '@mantine/core';
import {
  IconCalendar,
  IconCheck,
  IconCopy as IconClone,
  IconCopy,
  IconEdit,
  IconEye,
  IconHeart,
  IconHeartFilled,
  IconHistory,
  IconPlayerPlay,
  IconUser,
  IconX,
} from '@tabler/icons-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useApi } from 'src/api';
import { PromptResponseDto } from 'src/api/generated/models';
import { texts } from 'src/texts';
import { VersionCommentModal } from './VersionCommentModal';

interface PromptDetailsSectionProps {
  prompt: PromptResponseDto;
  selectedVersionContent?: string;
  onPromptSelect?: (prompt: PromptResponseDto) => void;
  onClose: () => void;
}

export function PromptDetailsSection({ prompt, selectedVersionContent, onPromptSelect, onClose }: PromptDetailsSectionProps) {
  const api = useApi();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editCategoryId, setEditCategoryId] = useState<number | null>(null);
  const [showVersionCommentModal, setShowVersionCommentModal] = useState(false);

  // Fetch categories for editing (temporarily disabled until backend is fixed)
  const { data: categories = [] } = useQuery({
    queryKey: ['prompt-categories'],
    queryFn: () => Promise.resolve([] as Array<{ id: number; name: string }>),
    enabled: false, // Disabled until backend controller is fixed
    retry: false,
  });

  // Update prompt mutation with version comment
  const updatePromptMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: { title?: string; description?: string; content?: string; categoryId?: number; versionComment: string };
    }) => api.prompts.promptsControllerUpdate(id, data),
    onSuccess: () => {
      toast.success('Prompt erfolgreich aktualisiert!');
      setIsEditing(false);
      setShowVersionCommentModal(false);
      void queryClient.invalidateQueries({ queryKey: ['prompt', prompt.id] });
      void queryClient.invalidateQueries({ queryKey: ['prompt-versions', prompt.id] });
      void queryClient
        .invalidateQueries({
          predicate: (query) => {
            const key = query.queryKey[0];
            return key === 'prompts' || key === 'prompts-library';
          },
        })
        .catch(() => {
          // Ignore invalidation errors
        });
    },
    onError: () => {
      toast.error('Fehler beim Aktualisieren des Prompts');
    },
  });

  const usePromptMutation = useMutation({
    mutationFn: (id: number) => api.prompts.promptsControllerRecordUsage(id),
    onSuccess: () => {
      if (prompt && onPromptSelect) {
        onPromptSelect(prompt);
        onClose();
      }
      void queryClient
        .invalidateQueries({
          predicate: (query) => {
            const key = query.queryKey[0];
            return key === 'prompts' || key === 'prompts-library';
          },
        })
        .catch(() => {
          // Ignore invalidation errors
        });
    },
    onError: () => {
      toast.error('Fehler beim Verwenden des Prompts');
    },
  });

  const clonePromptMutation = useMutation({
    mutationFn: (id: number) => api.prompts.promptsControllerClone(id),
    onSuccess: () => {
      toast.success('Prompt erfolgreich geklont!');
      void queryClient
        .invalidateQueries({
          predicate: (query) => {
            const key = query.queryKey[0];
            return key === 'prompts' || key === 'prompts-library';
          },
        })
        .catch(() => {
          // Ignore invalidation errors
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
    if (prompt?.id) {
      clonePromptMutation.mutate(prompt.id);
    }
  };

  const handleCopyPrompt = async () => {
    const contentToCopy = selectedVersionContent || prompt?.content;
    if (contentToCopy) {
      try {
        await navigator.clipboard.writeText(contentToCopy);
        toast.success('Prompt in Zwischenablage kopiert!');
      } catch {
        toast.error('Fehler beim Kopieren');
      }
    }
  };

  const handleStartEdit = () => {
    if (prompt) {
      setEditTitle(prompt.title);
      setEditDescription(prompt.description || '');
      setEditContent(prompt.content);
      setEditCategoryId(prompt.category?.id || null);
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditTitle('');
    setEditDescription('');
    setEditContent('');
    setEditCategoryId(null);
  };

  const handleSaveEdit = () => {
    if (prompt?.id && editTitle.trim() && editContent.trim()) {
      setShowVersionCommentModal(true);
    }
  };

  const handleVersionCommentSubmit = (comment: string) => {
    if (prompt?.id) {
      updatePromptMutation.mutate({
        id: prompt.id,
        data: {
          title: editTitle.trim(),
          description: editDescription.trim() || undefined,
          content: editContent.trim(),
          categoryId: editCategoryId || undefined,
          versionComment: comment,
        },
      });
    }
  };

  const handleVersionCommentClose = () => {
    setShowVersionCommentModal(false);
  };

  return (
    <>
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between" align="flex-start">
          <div className="flex-1">
            {isEditing ? (
              <Stack gap="sm">
                <TextInput
                  label={texts.chat.prompts.labels.title}
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                />
                <TextInput
                  label={texts.chat.prompts.labels.description}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder={texts.chat.prompts.placeholders.optionalDescription}
                />
                <Select
                  label={texts.chat.prompts.labels.category}
                  value={editCategoryId?.toString() || null}
                  onChange={(value) => setEditCategoryId(value ? parseInt(value) : null)}
                  data={categories.map((cat) => ({
                    value: cat.id.toString(),
                    label: cat.name,
                  }))}
                  placeholder={texts.chat.prompts.placeholders.selectCategory}
                  clearable
                />
              </Stack>
            ) : (
              <>
                <Text size="xl" fw={700} mb="xs">
                  {prompt.title}
                </Text>
                {prompt.description && (
                  <Text size="sm" c="dimmed" mb="sm">
                    {prompt.description}
                  </Text>
                )}
              </>
            )}
          </div>
          <Group gap="xs">
            {isEditing ? (
              <>
                <Tooltip label={texts.chat.prompts.messages.saveChanges} position="top" withArrow>
                  <ActionIcon
                    variant="light"
                    color="green"
                    size="lg"
                    onClick={handleSaveEdit}
                    loading={updatePromptMutation.isPending}
                  >
                    <IconCheck size={18} />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label={texts.chat.prompts.messages.cancelEdit} position="top" withArrow>
                  <ActionIcon variant="light" color="red" size="lg" onClick={handleCancelEdit}>
                    <IconX size={18} />
                  </ActionIcon>
                </Tooltip>
              </>
            ) : (
              <>
                <Tooltip label={texts.chat.prompts.tooltips.editPrompt} position="top" withArrow>
                  <ActionIcon variant="light" color="blue" size="lg" onClick={handleStartEdit}>
                    <IconEdit size={18} />
                  </ActionIcon>
                </Tooltip>
                <Tooltip
                  label={
                    isFavorite ? texts.chat.prompts.messages.removeFromFavorites : texts.chat.prompts.messages.addToFavorites
                  }
                  position="top"
                  withArrow
                >
                  <ActionIcon
                    variant={isFavorite ? 'filled' : 'light'}
                    color="red"
                    size="lg"
                    onClick={() => setIsFavorite(!isFavorite)}
                  >
                    {isFavorite ? <IconHeartFilled size={18} /> : <IconHeart size={18} />}
                  </ActionIcon>
                </Tooltip>
              </>
            )}
          </Group>
        </Group>

        {/* Stats */}
        <Group gap="xl">
          <Tooltip
            label={texts.chat.prompts.messages.averageRating(Number(prompt.averageRating) || 0, prompt.ratingCount || 0)}
            position="top"
            withArrow
          >
            <Group gap="xs">
              <Rating value={prompt.averageRating || 0} readOnly size="sm" />
              <Text size="sm" c="dimmed">
                {(Number(prompt.averageRating) || 0).toFixed(1)} ({prompt.ratingCount || 0} {texts.chat.prompts.tabs.ratings})
              </Text>
            </Group>
          </Tooltip>
          <Tooltip label={texts.chat.prompts.messages.usageCount} position="top" withArrow>
            <Group gap="xs">
              <IconEye size={16} className="text-gray-500" />
              <Text size="sm" c="dimmed">
                {prompt.usageCount} {texts.chat.prompts.messages.usedTimes}
              </Text>
            </Group>
          </Tooltip>
          <Tooltip label={texts.chat.prompts.messages.currentVersion} position="top" withArrow>
            <Group gap="xs">
              <IconHistory size={16} className="text-gray-500" />
              <Text size="sm" c="dimmed">
                v1.0
              </Text>
            </Group>
          </Tooltip>
        </Group>

        {/* Author and Date */}
        <Group gap="xl">
          <Group gap="xs">
            <IconUser size={16} className="text-gray-500" />
            <Text size="sm">{prompt.author?.name || 'Unknown'}</Text>
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
            {texts.chat.prompts.labels.content}
          </Text>
          {isEditing ? (
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              minRows={8}
              maxRows={15}
              required
              placeholder={texts.chat.prompts.placeholders.enterContent}
            />
          ) : (
            <Card withBorder p="md" className="bg-gray-50">
              <div style={{ maxHeight: 300, overflow: 'auto' }}>
                <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
                  {selectedVersionContent || prompt.content}
                </Text>
              </div>
            </Card>
          )}
        </div>

        {/* Actions */}
        <Group gap="sm">
          <Tooltip label={texts.chat.prompts.tooltips.useInChat} position="top" withArrow>
            <Button
              leftSection={<IconPlayerPlay size={16} />}
              onClick={handleUsePrompt}
              loading={usePromptMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {texts.chat.prompts.buttons.use}
            </Button>
          </Tooltip>
          <Tooltip label={texts.chat.prompts.tooltips.clonePrompt} position="top" withArrow>
            <Button
              variant="light"
              leftSection={<IconClone size={16} />}
              onClick={handleClonePrompt}
              loading={clonePromptMutation.isPending}
            >
              {texts.chat.prompts.buttons.clone}
            </Button>
          </Tooltip>
          <Tooltip label={texts.chat.prompts.tooltips.copyToClipboard} position="top" withArrow>
            <Button variant="light" leftSection={<IconCopy size={16} />} onClick={handleCopyPrompt}>
              {texts.chat.prompts.buttons.toClipboard}
            </Button>
          </Tooltip>
        </Group>
      </Stack>

      <VersionCommentModal
        opened={showVersionCommentModal}
        onClose={handleVersionCommentClose}
        onSubmit={handleVersionCommentSubmit}
        title="Version Comment for Update"
        description="Briefly describe what was changed in this version."
        loading={updatePromptMutation.isPending}
      />
    </>
  );
}
