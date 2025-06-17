import { Button, Tooltip } from '@mantine/core';
import { useMutation } from '@tanstack/react-query';
import { useFormContext } from 'react-hook-form';
import { toast } from 'react-toastify';
import { UpsertBucketDto, useApi } from 'src/api';
import { buildError } from 'src/lib';
import { texts } from 'src/texts';

export function TestButton() {
  const api = useApi();

  const form = useFormContext<UpsertBucketDto>();
  const testing = useMutation({
    mutationFn: () => {
      const values = form.getValues();

      return api.files.testBucket(values);
    },
    onSuccess: () => {
      toast.success(texts.files.testSuccess);
    },
    onError: async (error) => {
      toast.error(await buildError(texts.files.testFailed, error));
    },
  });

  const isDisabled = !form.formState.isValid || testing.isPending;

  return (
    <Tooltip label={texts.files.testTooltip}>
      <Button type="button" variant="outline" disabled={isDisabled} onClick={() => testing.mutate()} loading={testing.isPending}>
        {texts.extensions.test}
      </Button>
    </Tooltip>
  );
}
