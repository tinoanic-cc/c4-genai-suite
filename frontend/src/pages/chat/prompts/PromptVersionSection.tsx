import { Badge, Button, Card, Group, Stack, Text, Tooltip } from '@mantine/core';
import { IconRestore } from '@tabler/icons-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useApi } from 'src/api';
import { PromptVersionResponseDto } from 'src/api/generated/models';
import { texts } from 'src/texts';
import { VersionCommentModal } from './VersionCommentModal';

interface PromptVersionSectionProps {
  promptId: number;
  onVersionSelect?: (version: PromptVersionResponseDto) => void;
}

export function PromptVersionSection({ promptId, onVersionSelect }: PromptVersionSectionProps) {
  const api = useApi();
  const queryClient = useQueryClient();
  const [showVersionCommentModal, setShowVersionCommentModal] = useState(false);
  const [restoreVersionNumber, setRestoreVersionNumber] = useState<number | null>(null);

  // Fetch versions
  const { data: versions = [] } = useQuery({
    queryKey: ['prompt-versions', promptId],
    queryFn: () => api.prompts.promptsControllerGetVersions(promptId),
    enabled: !!promptId,
    retry: false,
  });

  // Restore version mutation
  const restoreVersionMutation = useMutation({
    mutationFn: ({
      promptId,
      versionNumber,
      versionComment: _versionComment,
    }: {
      promptId: number;
      versionNumber: number;
      versionComment: string;
    }) => api.prompts.promptsControllerRestoreVersion(promptId, versionNumber),
    onSuccess: () => {
      toast.success('Version erfolgreich wiederhergestellt!');
      setShowVersionCommentModal(false);
      setRestoreVersionNumber(null);
      void queryClient.invalidateQueries({ queryKey: ['prompt', promptId] });
      void queryClient.invalidateQueries({ queryKey: ['prompt-versions', promptId] });
      void queryClient.invalidateQueries({
        predicate: (query) => {
          const key = query.queryKey[0];
          return key === 'prompts' || key === 'prompts-library';
        },
      });
    },
    onError: () => {
      toast.error('Fehler beim Wiederherstellen der Version');
    },
  });

  const handleRestoreVersion = (versionNumber: number) => {
    setRestoreVersionNumber(versionNumber);
    setShowVersionCommentModal(true);
  };

  const handleVersionCommentSubmit = (comment: string) => {
    if (promptId && restoreVersionNumber) {
      restoreVersionMutation.mutate({
        promptId,
        versionNumber: restoreVersionNumber,
        versionComment: comment,
      });
    }
  };

  const handleVersionCommentClose = () => {
    setShowVersionCommentModal(false);
    setRestoreVersionNumber(null);
  };

  return (
    <>
      <Stack gap="lg">
        <Text size="sm" fw={600}>
          {texts.chat.prompts.labels.versionHistory}
        </Text>
        {versions.length === 0 ? (
          <Text size="sm" c="dimmed" ta="center" py="xl">
            {texts.chat.prompts.messages.noVersions}
          </Text>
        ) : (
          <Stack gap="sm">
            {versions.map((version) => (
              <Card
                key={version.id}
                withBorder
                p="md"
                className="cursor-pointer transition-colors hover:bg-gray-50"
                onClick={() => onVersionSelect?.(version)}
              >
                <Group justify="space-between" align="flex-start">
                  <div className="flex-1">
                    <Group gap="sm" mb="xs">
                      <Badge variant="light" color="blue" size="sm">
                        v{version.version}
                      </Badge>
                      <Text size="sm" fw={500}>
                        Version {version.version}
                      </Text>
                    </Group>
                    <Group gap="sm" mb="xs">
                      <Text size="xs" c="dimmed">
                        Unknown Author
                      </Text>
                      <Text size="xs" c="dimmed">
                        {new Date(version.createdAt).toLocaleDateString('de-DE', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Text>
                    </Group>
                  </div>
                  <Tooltip label={texts.chat.prompts.messages.restoreVersion(version.version)} position="top" withArrow>
                    <Button
                      size="xs"
                      variant="light"
                      leftSection={<IconRestore size={14} />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRestoreVersion(version.version);
                      }}
                      loading={restoreVersionMutation.isPending}
                    >
                      {texts.chat.prompts.buttons.restore}
                    </Button>
                  </Tooltip>
                </Group>
              </Card>
            ))}
          </Stack>
        )}
      </Stack>

      <VersionCommentModal
        opened={showVersionCommentModal}
        onClose={handleVersionCommentClose}
        onSubmit={handleVersionCommentSubmit}
        title="Version Comment for Restore"
        description={`Briefly describe why you are restoring version ${restoreVersionNumber}.`}
        loading={restoreVersionMutation.isPending}
      />
    </>
  );
}
