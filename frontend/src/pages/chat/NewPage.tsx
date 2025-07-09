import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useApi } from 'src/api';
import { useTransientContext, useTransientNavigate } from 'src/hooks';
import { useUserBucket } from 'src/pages/chat/useUserBucket';

interface NewPageProps {
  name?: string;
}

export function NewPage(props: NewPageProps) {
  const api = useApi();
  const { selectedConfigurationId } = useUserBucket();
  const location = useLocation();

  const { data: loadedConfigurations } = useQuery({
    queryKey: ['enabled-configurations'],
    queryFn: () => api.extensions.getConfigurations(true),
    refetchOnWindowFocus: false,
  });

  const context = useTransientContext();
  const navigate = useTransientNavigate();
  const { mutate } = useMutation({
    mutationFn: (data: { configurationId?: number }) =>
      api.conversations.postConversation({ ...data, name: props.name, context }),
    onSuccess: (conversation) => {
      const initialPrompt = (location.state as { initialPrompt?: string })?.initialPrompt;
      // Pass the initial prompt as state to the conversation page
      navigate(`/chat/${conversation.id}`, {
        state: { initialPrompt },
      });
    },
  });

  useEffect(() => {
    const configuration = loadedConfigurations?.items.find((x) => x.id === selectedConfigurationId);
    mutate({ configurationId: configuration?.id });
  }, [mutate, loadedConfigurations, selectedConfigurationId]);

  return null;
}
