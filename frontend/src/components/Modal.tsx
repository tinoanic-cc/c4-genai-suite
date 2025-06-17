import { Modal as MantineDialog, ModalProps as MantineModalProps, ScrollArea } from '@mantine/core';
import { PropsWithChildren, ReactNode } from 'react';

type ModalProps = {
  footer?: ReactNode;
  header?: ReactNode;
  onClose?: () => void;
} & PropsWithChildren &
  Omit<MantineModalProps, 'opened' | 'onClose'>;

export function Modal({ children, footer, header, onClose, ...mantineModalProps }: ModalProps) {
  return (
    <MantineDialog
      withinPortal={false}
      size="lg"
      opened
      onClose={() => onClose?.()}
      title={<b>{header}</b>}
      radius={'lg'}
      {...mantineModalProps}
    >
      <div className="grid gap-4">
        <ScrollArea.Autosize type="hover" offsetScrollbars mah={'70vh'}>
          {children}
        </ScrollArea.Autosize>
        {footer}
      </div>
    </MantineDialog>
  );
}
