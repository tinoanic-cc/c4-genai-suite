import { useQuery } from '@tanstack/react-query';
import { useApi } from 'src/api';

export const useDocumentContent = (docId: number | undefined, chunkIds: string[]) => {
  const api = useApi();
  return useQuery({
    queryFn: () => api.files.getDocumentContent(docId!, chunkIds),
    queryKey: ['files', 'document-content', { docId }, { chunkIds }],
    enabled: docId != null,
  });
};

export const useConversationFiles = (conversationId: number) => {
  const api = useApi();

  return useQuery({
    queryKey: ['files', 'conversation-files', { conversationId }],
    queryFn: () => api.files.getUserFiles(undefined, undefined, undefined, conversationId),
    select: (data) => data.items,
  });
};
