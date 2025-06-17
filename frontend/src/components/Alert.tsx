import { Alert as MantineAlert } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { ReactNode } from 'react';
import Markdown from 'react-markdown';

interface AlertProps {
  text?: string;
  title?: ReactNode;
  className?: string;
  children?: ReactNode;
}

export function Alert({ className, children, text, title }: AlertProps) {
  return (
    <MantineAlert variant="light" color="red" icon={<IconInfoCircle />} title={title} className={className}>
      <Markdown>{text}</Markdown>
      {children}
    </MantineAlert>
  );
}
