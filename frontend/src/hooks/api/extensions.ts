import { useQuery } from '@tanstack/react-query';
import { BucketDtoTypeEnum, useApi } from 'src/api';

export const useConversationBucketAvailabilities = (configurationId: number | undefined) => {
  const api = useApi();
  return useQuery({
    queryKey: ['extensions', 'bucket-availability', 'conversation', { configurationId }],
    queryFn: () => api.extensions.getBucketAvailability(configurationId!, BucketDtoTypeEnum.Conversation),
    enabled: configurationId != null,
  });
};
