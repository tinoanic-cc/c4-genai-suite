import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Observable } from 'rxjs';
import { create } from 'zustand';
import {
  AppClient,
  ConversationDto,
  FileDto,
  MessageDto,
  SourceDto,
  StreamEventDto,
  StreamMessageSavedDtoMessageTypeEnum,
  StreamUIRequestDto,
  useApi,
} from 'src/api';

type MessageMetaInfoState = {
  toolsInUse: Record<string, 'Started' | 'Completed'>;
  tokenCount?: number;
  debug: string[];
  sources: SourceDto[];
  logging: string[];
  error?: string;
  isAiWriting?: boolean;
  ui?: StreamUIRequestDto;
};

const getMessagePlaceholderId = (messageType: StreamMessageSavedDtoMessageTypeEnum) => {
  return messageType === 'ai' ? -1 : 0;
};

export type ChatMessage = MessageDto & Partial<MessageMetaInfoState>;

export const useAIConversation = () => {
  const api = useApi();
  const conversationStore = useConversationsStore();
  const initialQueryGetConversations = useQuery({
    queryKey: ['conversations'],
    queryFn: () => api.conversations.getConversations(),
  });

  useEffect(() => {
    if (initialQueryGetConversations.data) conversationStore.setConversations(initialQueryGetConversations.data.items);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQueryGetConversations.data]);

  useEffect(() => {
    const refetchFn = () => {
      void initialQueryGetConversations.refetch();
    };
    conversationStore.setRefetchFn(refetchFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQueryGetConversations.refetch]);

  const { getStream, addMessage, setIsAiWritting, appendLastMessage, updateLastMessage, updateMessage, setMessages, messages } =
    useChatStore_();
  return {
    setConversations: conversationStore.setConversations,
    setConversation: conversationStore.setConversation,
    removeConversation: conversationStore.removeConversation,
    conversations: conversationStore.conversations,
    refetch: conversationStore.refetch,
    sendMessage: (conversationId: number, input: string, files?: FileDto[], editMessageId?: number) => {
      if (editMessageId) {
        setMessages(messages.filter((message) => message.id > 0 && message.id < editMessageId));
      }

      addMessage({
        type: 'human',
        content: [{ type: 'text', text: input }],
        id: editMessageId ?? getMessagePlaceholderId('human'),
      });
      addMessage({ type: 'ai', content: [{ type: 'text', text: '' }], id: getMessagePlaceholderId('ai') });
      setIsAiWritting(true);

      getStream(conversationId, input, files, api, editMessageId).subscribe({
        next: (msg) => {
          if (msg.type === 'error' || msg.type === 'completed') setIsAiWritting(false);

          switch (msg.type) {
            case 'chunk': {
              const chunk = msg.content[0];
              if (chunk.type === 'text') appendLastMessage(chunk.text);
              if (chunk.type === 'image_url') appendLastMessage(`![image](${chunk.image.url})`);
              // We should try to handle all image_url to markdown conversions
              // within the c4 backend in the future.
              // E.g. the c4 dall-e tool sends images as markdown right away already.
              return;
            }
            case 'tool_start':
              return updateLastMessage((oldMessage) => ({
                toolsInUse: { ...oldMessage.toolsInUse, [msg.tool.name]: 'Started' },
              }));
            case 'tool_end':
              return updateLastMessage((oldMessage) => ({
                toolsInUse: { ...oldMessage.toolsInUse, [msg.tool.name]: 'Completed' },
              }));
            // We should think about renaming the 'debug' case below, because it mostly shows the sources of files
            // (also maybe files should not be sent as markdown ...) // added sources case - should replace the debug in the future
            // debug will be replaced by sources. debug stays as a fallback for now but can be removed as soon as RAG servers are not in use anymore
            case 'debug':
              return updateLastMessage((oldMessage) => ({ debug: [...(oldMessage.debug || []), msg.content] }));
            case 'sources':
              return updateLastMessage((oldMessage) => ({ sources: [...(oldMessage.sources || []), ...msg.content] }));
            case 'logging':
              return updateLastMessage((oldMessage) => ({ logging: [...(oldMessage.logging || []), msg.content] }));
            case 'error':
              return updateLastMessage({ error: msg.message });
            case 'completed':
              return updateLastMessage({ tokenCount: msg.metadata.tokenCount });
            case 'saved':
              return updateMessage(getMessagePlaceholderId(msg.messageType), { id: msg.messageId });
            case 'ui':
              return updateLastMessage({ ui: msg.request });
            case 'summary':
              conversationStore.refetch();
          }
        },
        error: (error: string | Error) => {
          const message = error instanceof Error ? error.message : error;
          updateLastMessage({ error: message });
          setIsAiWritting(false);
        },
        complete: () => {
          conversationStore.refetch();
          setIsAiWritting(false);
        },
      });
    },
  };
};

type ChatState = {
  messages: ChatMessage[];
  conversation: ConversationDto;
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  updateMessage: (
    messageId: number,
    messageUpdate: Partial<ChatMessage> | ((oldMessage: ChatMessage) => Partial<ChatMessage>),
  ) => void;
  updateLastMessage: (messageUpdate: Partial<ChatMessage> | ((oldMessage: ChatMessage) => Partial<ChatMessage>)) => void;
  appendLastMessage: (text: string) => void;
  setConversation: (conversation: ConversationDto) => void;
  isAiWritting?: boolean;
  setIsAiWritting: (isAiWritting: boolean) => void;
  getStream: (
    conversationId: number,
    input: string,
    files: FileDto[] | undefined,
    api: AppClient,
    editMessageId: number | undefined,
  ) => Observable<StreamEventDto>;
};

// If useChatStore uses Zustand, there is no need to pass it down to components.
// Every call of a Zustand hook will give access to the same state!
const useChatStore_ = create<ChatState>()((set) => {
  return {
    conversation: { id: 0, configurationId: -1, createdAt: new Date() },
    messages: [],
    getStream: (conversationId, query, files, api, editMessageId) =>
      api.stream.streamPrompt(conversationId, { query, files }, editMessageId),
    // We may want to improve readability here using "immer".
    // However, we should also store the message text (including the images as markdown)
    // into a simple string variable.
    // It seems some chunk structure was abused to fit the UI code in the past.
    appendLastMessage: (text) =>
      set((state) => {
        const lastMsg = state.messages.pop();
        if (lastMsg && lastMsg.content[0]) {
          const contentItem = lastMsg.content[0];
          if (contentItem.type === 'text') {
            const newText = contentItem.text + text;
            const newMsg: MessageDto = { ...lastMsg, content: [{ type: 'text', text: newText }] };
            return { messages: [...state.messages, newMsg] };
          }
        }
        return { messages: state.messages };
      }),
    updateLastMessage: (messageUpdate) =>
      set((state) => {
        const lastMsg = state.messages.pop();
        if (!lastMsg) return { messages: state.messages };
        const messageUpdates = typeof messageUpdate === 'function' ? messageUpdate(lastMsg) : messageUpdate;
        const newMsg: MessageDto = { ...lastMsg, ...messageUpdates };
        return { messages: [...state.messages, newMsg] };
      }),
    updateMessage: (messageId, messageUpdate) =>
      set((state) => {
        const selectedMsg = state.messages.find((msg) => msg.id === messageId);
        if (!selectedMsg) return { messages: state.messages };
        const messageUpdates = typeof messageUpdate === 'function' ? messageUpdate(selectedMsg) : messageUpdate;
        const newMsg: MessageDto = { ...selectedMsg, ...messageUpdates };
        const messages = state.messages.map((msg) => (msg.id === messageId ? newMsg : msg));
        return { messages };
      }),
    addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
    setMessages: (messages) => set({ messages, isAiWritting: false }),
    setConversation: (conversation) => set({ conversation }),
    setIsAiWritting: (isAiWritting) => set({ isAiWritting }),
  };
});

/**
 * @deprecated Using Zustand hooks directly in ui-components is deprecated. Use
 * other hooks to wrap the Zustand hook instead. We want hooks to have
 * interfaces that fit our domains terminology. E.g. useAIConversation exports
 * a function called sendMessage, which will talk to the LLM and update the
 * messages internally. No separate call to a Zustand hook has to be made in
 * order to update messages after using sendMessage. An ideal version of the
 * useAIConversation hook exports only actions like sendMessage and states like
 * messages, but no setters.
 **/
export const useChatStore = useChatStore_;

type ConversationsState = {
  conversations: ConversationDto[];
  setConversations: (conversations: ConversationDto[]) => void;
  setConversation: (conversation: ConversationDto) => void;
  removeConversation: (id: number) => void;
  refetch: VoidFunction;
  setRefetchFn: (refetchFn: VoidFunction) => void;
};

const useConversationsStore = create<ConversationsState>()((set) => ({
  conversations: [],
  setConversations: (conversations) => set({ conversations }),
  setConversation: (conversation) =>
    set(({ conversations }) => {
      const exists = conversations.some((existingConversation) => existingConversation.id === conversation.id);
      if (!exists) return { conversations: [...conversations, conversation] };
      return {
        conversations: conversations.map((existingConversation) =>
          existingConversation.id === conversation.id ? conversation : existingConversation,
        ),
      };
    }),
  removeConversation: (id) => set((state) => ({ conversations: state.conversations.filter((x) => x.id !== id) })),
  refetch: () => {},
  setRefetchFn: (refetch) => set({ refetch }),
}));
