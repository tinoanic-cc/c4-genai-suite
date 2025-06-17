import { ActionIcon, Alert, Button, Flex } from '@mantine/core';
import { IconAlertCircle, IconCircleCheck, IconClipboard, IconThumbDown } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { MessageDtoRatingEnum, ProfileDto, useApi } from 'src/api';
import { Icon } from 'src/components';
import { cn } from 'src/lib';
import { texts } from 'src/texts';
import { useChatStore } from '../../state';

interface AIChatItemActionsProps {
  conversationId: number;
  tokenCount?: number;
  messageId: number;
  renderAlways?: boolean;
  rating?: MessageDtoRatingEnum;
  user: ProfileDto;
  copyTextToClipboard: () => void;
}

const RATINGS: MessageDtoRatingEnum[] = ['incorrect', 'instructions_not_followed', 'insufficient_style', 'lazy', 'refused'];

const useVisibilityToggle = () => {
  const [isVisible, setIsVisible] = useState(false);
  return {
    isVisible,
    toggleVisibility: () => setIsVisible(!isVisible),
    setHiddenVisibility: () => setIsVisible(false),
  };
};

export const AIChatItemActions = ({
  conversationId,
  messageId,
  copyTextToClipboard,
  rating,
  renderAlways,
  tokenCount,
  user,
}: AIChatItemActionsProps) => {
  const scrollTargetRef = useRef<HTMLDivElement>(null);
  const api = useApi();
  const { updateMessage } = useChatStore();

  // This query should ideally be moved into the main chat hook (currently in state.ts)
  const updateRating = useMutation({
    mutationFn: async (ratingValue: MessageDtoRatingEnum) => {
      await api.conversations.rateMessage(conversationId, messageId, { rating: ratingValue });
      return ratingValue;
    },
    onSuccess: (response) => {
      updateMessage(messageId, { rating: response });
    },
  });

  const { isVisible: isRatingSelectorVisible, toggleVisibility, setHiddenVisibility } = useVisibilityToggle();

  useEffect(() => {
    if (isRatingSelectorVisible && scrollTargetRef.current) {
      scrollTargetRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [isRatingSelectorVisible]);

  if (messageId === 0) {
    return null;
  }
  return (
    <>
      <div
        className={cn(
          { 'fade-in opacity-100': renderAlways },
          'my-1 flex items-center opacity-0 transition-all group-hover:opacity-100',
        )}
      >
        <ActionIcon color="gray" c="black" size={'lg'} variant="subtle" onClick={copyTextToClipboard}>
          <IconClipboard className="w-4" />
        </ActionIcon>
        <ActionIcon onClick={toggleVisibility} color="gray" c="black" size={'lg'} variant="subtle">
          <IconThumbDown className="w-4" />
        </ActionIcon>

        {user.isAdmin && tokenCount && tokenCount > 0 && (
          <div className="ms-2 text-sm text-gray-600">
            {tokenCount} {texts.common.tokens}
          </div>
        )}
      </div>

      {isRatingSelectorVisible && (
        <>
          <div className="relative mt-2 mb-8 rounded-xl border-[1px] border-gray-300 p-4">
            <button className="btn btn-ghost btn-sm absolute top-1 right-1 p-2" onClick={setHiddenVisibility}>
              <Icon size={16} icon="close" />
            </button>

            <div className="mb-2 text-sm">{texts.chat.ratingHint}</div>

            <div className={cn('flex flex-wrap gap-2', { 'opacity-50': updateRating.status === 'pending' })}>
              {updateRating.status === 'success' && (
                <Alert
                  variant="light"
                  color="green"
                  title={<p>{texts.chat.updateRating.ratingSubmitted}</p>}
                  icon={<IconCircleCheck />}
                  p="xs"
                  w="100%"
                >
                  <p>{texts.chat.updateRating.thanksForYourValuableFeedback}</p>
                  <Flex>
                    <Button variant="light" size="compact-xs" color="green" mt="xs" onClick={updateRating.reset}>
                      {texts.chat.updateRating.changeResponse}
                    </Button>
                    <Button variant="subtle" size="compact-xs" color="green" mt="xs" onClick={setHiddenVisibility}>
                      {texts.chat.updateRating.close}
                    </Button>
                  </Flex>
                </Alert>
              )}
              {updateRating.status === 'error' && updateRating.error instanceof Error && (
                <Alert
                  variant="light"
                  color="red"
                  title={<p>{texts.chat.updateRating.raitingFailed}</p>}
                  icon={<IconAlertCircle />}
                  p="xs"
                  w="100%"
                >
                  <p>{updateRating.error.message}</p>
                  <Button
                    variant="light"
                    size="compact-xs"
                    color="red"
                    mt="xs"
                    onClick={() => updateRating.variables && updateRating.mutate(updateRating.variables)}
                  >
                    {texts.chat.updateRating.retry}
                  </Button>
                </Alert>
              )}
              {['idle', 'pending'].includes(updateRating.status) &&
                RATINGS.map((ratingOption) => (
                  <button
                    key={ratingOption}
                    className={cn('btn btn-outline btn-sm border-gray-300', { 'bg-gray-200': rating === ratingOption })}
                    onClick={() => updateRating.mutate(ratingOption)}
                  >
                    {texts.chat.rating[ratingOption]}
                  </button>
                ))}
            </div>
          </div>
          <div ref={scrollTargetRef}></div>
        </>
      )}
    </>
  );
};
