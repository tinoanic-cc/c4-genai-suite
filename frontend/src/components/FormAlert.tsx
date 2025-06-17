import { Alert } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { buildError } from 'src/lib';

interface FormAlertProps {
  // The common message.
  common: string;

  // The actual error.
  error?: Error | null;

  // Optional class name
  className?: string;
}

export function FormAlert(props: FormAlertProps) {
  const { className, common, error } = props;

  const [message, setMessage] = useState('');

  useEffect(() => {
    async function format() {
      setMessage(await buildError(common, error));
    }

    if (error) {
      void format();
    }
  }, [common, error]);

  if (!error || !message) {
    return null;
  }

  return (
    <Alert variant="light" color="red" icon={<IconInfoCircle />} className={className}>
      {message}
    </Alert>
  );
}
