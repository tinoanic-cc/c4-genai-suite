import { useMutation } from '@tanstack/react-query';
import { addDays, addMonths, format, isSameDay, startOfDay, startOfMonth } from 'date-fns';
import { useMemo } from 'react';
import { toast } from 'react-toastify';
import { ConversationDto, useApi } from 'src/api';
import { useEventCallback } from 'src/hooks';
import { buildError } from 'src/lib';
import { texts } from 'src/texts';
import { Conversation } from './Conversation';
import { useAIConversation } from './state';

interface ConversationsProps {
  selectedConversationId: number | null;
  onConversationDeleted: (conversationId: number) => void;
}

type ConversationGroup = { date: string; entries: ConversationDto[] };

function groupConversations(conversations: ConversationDto[]): ConversationGroup[] {
  if (conversations.length === 0) {
    return [];
  }

  const now = new Date();
  const withinWeek = startOfDay(addDays(now, -7));
  const withinMonth = startOfDay(addDays(now, -30));
  const withinMonths = startOfMonth(addMonths(now, -3));

  const conversationGroups = Array.from(
    conversations
      .reduce((prev, curr) => {
        const date = curr.createdAt;

        let group: { label: string; date: Date };
        if (isSameDay(now, date)) {
          group = { label: texts.chat.today, date: now };
        } else if (date >= withinWeek) {
          group = { label: texts.chat.thisWeek, date: withinWeek };
        } else if (date >= withinMonth) {
          group = { label: texts.chat.thisMonth, date: withinMonth };
        } else if (date >= withinMonths) {
          group = { label: format(date, 'LLLL'), date: withinMonths };
        } else {
          group = { label: format(date, 'yyyy'), date: date };
        }

        const entry = prev.get(group.label) ?? { label: group.label, time: group.date.getTime(), entries: [] };
        entry.entries.push(curr);
        prev.set(group.label, entry);
        return prev;
      }, new Map<string, { label: string; time: number; entries: ConversationDto[] }>())
      .values(),
  );

  conversationGroups.sort((a, b) => b.time - a.time);
  return conversationGroups.map(({ label: date, entries }) => ({ date, entries }));
}

export function Conversations({ onConversationDeleted, selectedConversationId }: ConversationsProps) {
  const api = useApi();

  const { conversations, refetch, setConversation } = useAIConversation();

  const renaming = useMutation({
    mutationFn: ({ conversation, name }: { conversation: ConversationDto; name: string }) =>
      api.conversations.patchConversation(conversation.id, { name, isNameSetManually: true }),
    onSuccess: (conversation) => {
      setConversation(conversation);
    },
    onError: async () => {
      toast.error(await buildError(texts.chat.renameConversationFailed, texts.common.reloadAndTryAgain));
    },
  });

  const deleting = useMutation({
    mutationFn: (conversation: ConversationDto) => {
      return api.conversations.deleteConversation(conversation.id);
    },
    onSuccess: (_, conversation) => {
      refetch();
      onConversationDeleted(conversation.id);
    },
    onError: async () => {
      toast.error(await buildError(texts.chat.removeConversationFailed, texts.common.reloadAndTryAgain));
    },
  });

  const duplicate = useMutation({
    mutationFn: (conversationId: number) => {
      return api.conversations.duplicateConversation(conversationId);
    },
    onSuccess: () => {
      refetch();
      toast.success(texts.chat.duplicateConversationSuccess);
    },
    onError: async () => {
      toast.error(await buildError(texts.chat.duplicateConversationFailed));
    },
  });

  const doRename = useEventCallback((conversation: ConversationDto, name: string) => {
    renaming.mutate({ conversation, name });
  });

  const grouped = useMemo(() => {
    return groupConversations(conversations);
  }, [conversations]);

  return (
    <div className="flex flex-col gap-4">
      {grouped.map((group) => (
        <div key={group.date} className="grid">
          <h4 className="pb-1 pl-2 text-xs font-light">{group.date}</h4>
          <div className="grid">
            {group.entries.map((conversation) => (
              <Conversation
                key={conversation.id}
                selectedConversationId={selectedConversationId}
                conversation={conversation}
                onDelete={deleting.mutate}
                onRename={doRename}
                onDuplicate={duplicate.mutate}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
