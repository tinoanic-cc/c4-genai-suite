import { ActionIcon, Button, Card, Flex, Text } from '@mantine/core';
import { IconThumbDown, IconThumbUp, IconX } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { ConversationDto, ConversationDtoRatingEnum, useApi } from 'src/api';
import { texts } from 'src/texts';

interface ConversationRatingProps {
  conversation: ConversationDto;
}

export function ConversationRating({ conversation }: ConversationRatingProps) {
  const api = useApi();
  const [isVisible, setVisible] = useState(true);
  const [thanksForTheFeedback, setThanksForTheFeedback] = useState(false);

  const updating = useMutation({
    mutationFn: (rating: ConversationDtoRatingEnum) => {
      return api.conversations.patchConversation(conversation.id, { rating });
    },
    onSuccess: (_, rating) => {
      if (rating !== 'unrated') {
        setThanksForTheFeedback(true);
      }
      setVisible(false);
      setTimeout(() => setThanksForTheFeedback(false), 2000);
    },
  });

  if (thanksForTheFeedback)
    return (
      <Card withBorder radius={'lg'} shadow="lg" className="fade-in">
        <Flex gap={'xl'} align={'center'}>
          <Text size="sm" fw={500}>
            {texts.chat.updateRating.thanksForYourValuableFeedback}
          </Text>
          <ActionIcon variant="subtle" onClick={() => updating.mutate('unrated')}>
            <IconX className="w-4" />
          </ActionIcon>
        </Flex>
      </Card>
    );
  if (isVisible) {
    return (
      <Card withBorder radius={'lg'} shadow="lg" className="fade-in">
        <Flex gap={'xl'} align={'center'}>
          <Text size="sm" fw={500}>
            {texts.chat.rateConversation}
          </Text>
          <ActionIcon variant="subtle" onClick={() => updating.mutate('unrated')}>
            <IconX className="w-4" />
          </ActionIcon>
        </Flex>
        <Flex gap={'sm'} mt="lg" align={'center'} justify={'center'}>
          <Button
            color="red"
            onClick={() => updating.mutate('bad')}
            variant="outline"
            leftSection={<IconThumbDown className="w-4" />}
          >
            {texts.common.no}
          </Button>
          <Button
            color="green"
            onClick={() => updating.mutate('good')}
            variant="outline"
            leftSection={<IconThumbUp className="w-4" />}
          >
            {texts.common.yes}
          </Button>
        </Flex>
      </Card>
    );
  }
}
