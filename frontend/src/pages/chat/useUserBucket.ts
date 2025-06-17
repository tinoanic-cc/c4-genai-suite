import { useEffect, useState } from 'react';
import { BucketDtoTypeEnum, type ExtensionBucketSettingsDto, useApi } from 'src/api';
import { usePersistentState } from 'src/hooks';

export function useUserBucket() {
  const api = useApi();
  const [selectedConfigurationId, setSelectedConfigurationId] = usePersistentState<number>('configurationId', 0);
  const [userBucket, setUserBucket] = useState<ExtensionBucketSettingsDto>();

  useEffect(() => {
    if (selectedConfigurationId) {
      setUserBucket(undefined);
      api.extensions
        .getBucketAvailability(selectedConfigurationId, BucketDtoTypeEnum.User)
        .then((response) => {
          if (response.extensions.length) {
            const extension = response.extensions[0];
            setUserBucket(extension);
          }
        })
        .catch(() => {});
    }
  }, [selectedConfigurationId, api.extensions]);

  return { userBucket, selectedConfigurationId, setSelectedConfigurationId };
}
