import { Badge, Box, Button, Card, Group, Rating, Text, Tooltip } from '@mantine/core';
import { IconCopy, IconEye, IconLock, IconPlayerPlay, IconWorld } from '@tabler/icons-react';
import { PromptResponseDto } from 'src/api/generated/models';
import { texts } from 'src/texts';

interface PromptCardProps {
  prompt: PromptResponseDto;
  onUse: (prompt: PromptResponseDto) => void;
  onShowDetails: (promptId: number) => void;
}

export function PromptCard({ prompt, onUse, onShowDetails }: PromptCardProps) {
  // Utility function to get prompt preview
  const getPromptPreview = (content: string, maxLength: number = 150): string => {
    if (!content) return '';
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + '...';
  };

  return (
    <Card
      p="lg"
      withBorder
      className="flex h-full min-h-[320px] flex-col transition-shadow hover:shadow-lg"
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      {/* Header - Fixed height section */}
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
                <Badge size="xs" variant="light" color={prompt.category.color || 'blue'}>
                  {prompt.category.name}
                </Badge>
              )}
              <Badge
                size="xs"
                variant="light"
                color={prompt.isPublic ? 'green' : 'gray'}
                leftSection={prompt.isPublic ? <IconWorld size={10} /> : <IconLock size={10} />}
              >
                {prompt.isPublic ? 'Öffentlich' : 'Privat'}
              </Badge>
            </Group>
          </div>
          <Tooltip label={texts.chat.prompts.tooltips.copyPrompt} position="top" withArrow>
            <button
              type="button"
              className="rounded p-1 hover:bg-gray-100"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <IconCopy size={14} />
            </button>
          </Tooltip>
        </Group>
      </div>

      {/* Content - Flexible height section */}
      <div className="mb-4 flex-1">
        {prompt.content && (
          <Box p="xs" className="rounded border-l-2 border-blue-200 bg-gray-50">
            <Text size="xs" c="dimmed" mb="xs" fw={500}>
              Vorschau:
            </Text>
            <Text size="xs" c="dark" lineClamp={4} className="font-mono">
              {getPromptPreview(prompt.content, 200)}
            </Text>
          </Box>
        )}
      </div>

      {/* Footer - Fixed height section at bottom */}
      <div className="mt-auto">
        {/* Stats */}
        <Group justify="space-between" align="center" mb="sm">
          <Group gap="xs">
            <Tooltip
              label={texts.chat.prompts.messages.averageRating(Number(prompt.averageRating) || 0, prompt.ratingCount || 0)}
              position="top"
              withArrow
            >
              <Group gap={2}>
                <Rating value={prompt.averageRating || 0} readOnly size="xs" />
              </Group>
            </Tooltip>
            <Tooltip label={texts.chat.prompts.tooltips.currentVersion} position="top" withArrow>
              <Text size="xs" c="dimmed">
                v1.0
              </Text>
            </Tooltip>
            <Tooltip label={texts.chat.prompts.tooltips.usageCount} position="top" withArrow>
              <Group gap={2}>
                <IconEye size={12} className="text-gray-500" />
                <Text size="xs" c="dimmed">
                  {texts.chat.prompts.usageCount(prompt.usageCount || 0)}
                </Text>
              </Group>
            </Tooltip>
          </Group>
        </Group>

        {/* Author and Date */}
        <Group justify="space-between" align="center" mb="md">
          <Text size="xs" c="dimmed">
            {texts.chat.prompts.author(prompt.author?.name || 'Unknown')}
          </Text>
          <Text size="xs" c="dimmed">
            {texts.chat.prompts.createdAt(new Date(prompt.createdAt).toLocaleDateString('de-DE'))}
          </Text>
        </Group>

        {/* Actions - always at bottom */}
        <Group gap="xs">
          <Tooltip label={texts.chat.prompts.tooltips.showDetails} position="top" withArrow>
            <Button
              variant="light"
              size="sm"
              leftSection={<IconEye size={14} />}
              flex={1}
              onClick={() => onShowDetails(prompt.id)}
            >
              {texts.chat.prompts.buttons.details}
            </Button>
          </Tooltip>
          <Tooltip label={texts.chat.prompts.tooltips.useInChat} position="top" withArrow>
            <Button
              size="sm"
              leftSection={<IconPlayerPlay size={14} />}
              flex={1}
              onClick={() => onUse(prompt)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {texts.chat.prompts.buttons.execute}
            </Button>
          </Tooltip>
        </Group>
      </div>
    </Card>
  );
}
