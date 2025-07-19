import { Button, Card, Divider, Group, Progress, Rating, Stack, Text, Textarea } from '@mantine/core';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { CreatePromptRatingDto } from 'src/api/generated/models';
import { texts } from 'src/texts';

interface PromptRatingSectionProps {
  promptId: number;
  averageRating: number;
  ratingCount: number;
}

export function PromptRatingSection({ promptId, averageRating, ratingCount }: PromptRatingSectionProps) {
  const queryClient = useQueryClient();
  const [userRating, setUserRating] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [showRatingForm, setShowRatingForm] = useState(false);

  // Fetch ratings (temporarily disabled until backend is fixed)
  const { data: ratings = [] } = useQuery({
    queryKey: ['prompt-ratings', promptId],
    queryFn: () =>
      Promise.resolve(
        [] as Array<{ id: number; rating: number; comment?: string; createdAt: string; userId: number; user: { name: string } }>,
      ),
    enabled: false, // Disabled until backend controller is fixed
    retry: false,
  });

  // Fetch user's rating (temporarily disabled until backend is fixed)
  const { data: myRating } = useQuery({
    queryKey: ['my-rating', promptId],
    queryFn: () => Promise.resolve(null as { rating: number; comment?: string; createdAt: string; userId: number } | null),
    enabled: false, // Disabled until backend controller is fixed
    retry: false,
  });

  const ratePromptMutation = useMutation({
    mutationFn: ({ promptId: _promptId, data: _data }: { promptId: number; data: CreatePromptRatingDto }) => Promise.resolve(), // Temporarily disabled until ratings API is fixed
    onSuccess: () => {
      toast.success('Bewertung erfolgreich abgegeben!');
      setShowRatingForm(false);
      setUserRating(0);
      setRatingComment('');
      void queryClient.invalidateQueries({ queryKey: ['prompt-ratings', promptId] });
      void queryClient.invalidateQueries({ queryKey: ['my-rating', promptId] });
      void queryClient.invalidateQueries({ queryKey: ['prompt', promptId] });
      void queryClient.invalidateQueries({
        predicate: (query) => {
          const key = query.queryKey[0];
          return key === 'prompts' || key === 'prompts-library';
        },
      });
    },
    onError: () => {
      toast.error('Fehler beim Bewerten des Prompts');
    },
  });

  const handleSubmitRating = () => {
    if (promptId && userRating > 0) {
      ratePromptMutation.mutate({
        promptId,
        data: {
          rating: userRating,
          comment: ratingComment || undefined,
        },
      });
    }
  };

  const getRatingDistribution = () => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratings.forEach((rating) => {
      distribution[rating.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  const ratingDistribution = getRatingDistribution();
  const totalRatings = ratings.length;

  return (
    <Stack gap="lg">
      {/* Rating Overview */}
      <Card withBorder p="md">
        <Group justify="space-between" mb="md">
          <div>
            <Text size="xl" fw={700}>
              {averageRating.toFixed(1)}
            </Text>
            <Rating value={averageRating} readOnly size="sm" />
            <Text size="xs" c="dimmed">
              {ratingCount} {texts.chat.prompts.tabs.ratings}
            </Text>
          </div>
          <div className="max-w-xs flex-1">
            {[5, 4, 3, 2, 1].map((star) => (
              <Group key={star} gap="xs" mb="xs">
                <Text size="xs" w={20}>
                  {star}★
                </Text>
                <Progress
                  value={
                    totalRatings > 0 ? (ratingDistribution[star as keyof typeof ratingDistribution] / totalRatings) * 100 : 0
                  }
                  size="sm"
                  className="flex-1"
                />
                <Text size="xs" c="dimmed" w={30}>
                  {ratingDistribution[star as keyof typeof ratingDistribution]}
                </Text>
              </Group>
            ))}
          </div>
        </Group>

        {/* Rate this prompt */}
        {!myRating && (
          <div>
            <Divider mb="md" />
            {!showRatingForm ? (
              <Button variant="light" onClick={() => setShowRatingForm(true)} fullWidth>
                {texts.chat.prompts.buttons.rateThisPrompt}
              </Button>
            ) : (
              <Stack gap="sm">
                <Text size="sm" fw={600}>
                  {texts.chat.prompts.labels.yourRating}
                </Text>
                <Rating value={userRating} onChange={setUserRating} size="lg" />
                <Textarea
                  placeholder={texts.chat.prompts.placeholders.optionalComment}
                  value={ratingComment}
                  onChange={(e) => setRatingComment(e.target.value)}
                  minRows={2}
                  maxRows={4}
                />
                <Group gap="sm">
                  <Button
                    onClick={handleSubmitRating}
                    disabled={userRating === 0}
                    loading={ratePromptMutation.isPending}
                    size="sm"
                  >
                    {texts.chat.prompts.buttons.submitRating}
                  </Button>
                  <Button variant="subtle" onClick={() => setShowRatingForm(false)} size="sm">
                    {texts.chat.prompts.buttons.cancel}
                  </Button>
                </Group>
              </Stack>
            )}
          </div>
        )}

        {/* User's existing rating */}
        {myRating && (
          <div>
            <Divider mb="md" />
            <Text size="sm" fw={600} mb="sm">
              {texts.chat.prompts.labels.yourRating}
            </Text>
            <Group gap="sm" mb="sm">
              <Rating value={myRating.rating} readOnly size="sm" />
              <Text size="sm" c="dimmed">
                {new Date(myRating.createdAt).toLocaleDateString('de-DE')}
              </Text>
            </Group>
            {myRating.comment && (
              <Text size="sm" c="dimmed">
                &ldquo;{myRating.comment}&rdquo;
              </Text>
            )}
          </div>
        )}
      </Card>

      {/* Individual Ratings */}
      {ratings.length > 0 && (
        <div>
          <Text size="sm" fw={600} mb="sm">
            {texts.chat.prompts.labels.ratingsFromOthers}
          </Text>
          <Stack gap="sm">
            {ratings
              .filter((rating) => rating.userId !== myRating?.userId)
              .slice(0, 5)
              .map((rating) => (
                <Card key={rating.id} withBorder p="sm">
                  <Group justify="space-between" mb="xs">
                    <Group gap="sm">
                      <Text size="sm" fw={500}>
                        {rating.user.name}
                      </Text>
                      <Rating value={rating.rating} readOnly size="xs" />
                    </Group>
                    <Text size="xs" c="dimmed">
                      {new Date(rating.createdAt).toLocaleDateString('de-DE')}
                    </Text>
                  </Group>
                  {rating.comment && (
                    <Text size="sm" c="dimmed">
                      &ldquo;{rating.comment}&rdquo;
                    </Text>
                  )}
                </Card>
              ))}
          </Stack>
        </div>
      )}
    </Stack>
  );
}
