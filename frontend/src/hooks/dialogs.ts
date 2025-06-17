import { createContext, useContext } from 'react';

export interface DialogRequest {
  title: string;
  text: string;
  performText?: string;
  cancelText?: string;
  onPerform: () => void;
  onCancel?: () => void;
}

export interface DialogContext {
  showDialog(request: DialogRequest): void;
}

export const DialogContext = createContext<DialogContext>(null!);

export function useDialog() {
  return useContext(DialogContext);
}
