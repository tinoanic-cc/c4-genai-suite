import { ActionIcon, Button, Textarea } from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import { IconClipboard, IconPencil } from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { Alert } from 'src/components';
import { useEventCallback } from 'src/hooks';
import { useConversationFiles } from 'src/hooks/api/files';
import { cn } from 'src/lib';
import { texts } from 'src/texts';
import { ChatItemTools } from '../ChatItemTools';
import { ChatItemProps } from './ChatItemProps';
import { ChatItemUI } from './ChatItemUI';

export const HumanChatItem = ({ message, onSubmit, conversationId, isBeforeLast, isWriting }: ChatItemProps) => {
  const clipboard = useClipboard();
  const textContent = message.content[0]?.type === 'text' ? message.content[0].text : '';
  const [editedText, setEditedText] = useState(textContent);
  const [isEditing, setIsEditing] = useState(false);
  const { data: conversationFiles } = useConversationFiles(conversationId);
  const copyTextToClipboard = () => {
    clipboard.copy(textContent);
    toast(texts.common.copied, { type: 'info' });
  };

  const handleSave = () => {
    setIsEditing(false);
    onSubmit(editedText, conversationFiles, message.id);
  };

  const doKeyDown = useEventCallback((event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.ctrlKey) {
      handleSave();
    }
  });
  const chatItemContainer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isBeforeLast && isWriting) {
      setTimeout(
        () =>
          chatItemContainer?.current?.scrollIntoView({
            behavior: 'smooth',
          }),
        100,
      );
    }
  }, [isBeforeLast, isWriting]);

  return (
    <>
      <div
        ref={chatItemContainer}
        className={cn('group justify-self-end', isEditing ? 'w-full' : 'box-border max-w-full pl-32')}
        data-testid="chat-item"
      >
        {message.error && <Alert text={message.error} className="mt-1" />}
        <ChatItemTools tools={message.toolsInUse || {}} />
        {message.ui && <ChatItemUI request={message.ui} />}

        {isEditing ? (
          <div className="rounded-xl bg-gray-100 p-3">
            <Textarea value={editedText} onChange={(e) => setEditedText(e.target.value)} onKeyDown={doKeyDown} autosize />
            <div className="mt-2 flex items-center justify-end gap-2">
              <Button onClick={() => setIsEditing(false)} size="xs" variant="subtle">
                {texts.common.cancel}
              </Button>
              <Button onClick={handleSave} size="xs">
                {texts.common.send}
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="max-w-full rounded-xl bg-gray-100 px-4 py-3 whitespace-pre-wrap">{textContent}</div>
            <div className={'flex items-center justify-end opacity-0 group-hover:opacity-100'}>
              <ActionIcon color="gray" c="black" size={'lg'} variant="white" onClick={copyTextToClipboard}>
                <IconClipboard className="w-4" />
              </ActionIcon>
              <ActionIcon color="gray" c="black" size={'lg'} variant="white" onClick={() => setIsEditing(true)}>
                <IconPencil className="w-4" />
              </ActionIcon>
            </div>
          </>
        )}
      </div>
    </>
  );
};
