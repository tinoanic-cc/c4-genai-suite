import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ConversationDto, useApi } from 'src/api';

type JSONValue = string | number | boolean | JSONObject | JSONArray | object | undefined;

export type JSONObject = {
  [key: string]: JSONValue;
};

class JSONArray extends Array<JSONValue> {}

export type ExtensionContext = {
  [extensionId: string]: JSONObject;
};

export const useExtensionContext = (conversationId: number) => {
  const api = useApi();

  const queryClient = useQueryClient();

  const queryKey = ['conversation', conversationId, 'extensionArguments'];

  const selectContext = (dto: ConversationDto) => dto?.extensionUserArguments as ExtensionContext | undefined;

  const {
    data: conversation,
    error,
    isLoading,
  } = useQuery({
    queryKey,
    queryFn: () => api.conversations.getConversation(conversationId).then(selectContext),
    enabled: !!conversationId,
  });

  const mutation = useMutation({
    mutationFn: (context: ExtensionContext) =>
      api.conversations.patchConversation(conversationId, { extensionUserArguments: context }),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKey, () => selectContext(data));
    },
  });

  const updateContext = (newContext: ExtensionContext) => {
    mutation.mutate(newContext);
  };

  return {
    context: conversation,
    updateContext,
    error,
    isLoading,
    isUpdating: mutation.isPending,
    updateError: mutation.error,
  };
};
