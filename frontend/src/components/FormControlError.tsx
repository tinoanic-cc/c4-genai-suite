import { cn } from 'src/lib';

interface FormControlErrorProps {
  // The error.
  error?: string;

  // The submit count.
  submitCount: number;

  // True when the control is touched.
  touched: boolean;

  // The alignment.
  alignment?: 'left' | 'right';
}

export const FormControlError = (props: FormControlErrorProps) => {
  const { alignment, error, submitCount, touched } = props;

  if (!isErrorVisible(error, touched, submitCount)) {
    return null;
  }

  return (
    <div className="relative" role={'alert'}>
      <div className="border-t-error absolute -bottom-1 left-2 h-2 w-2 border-4 border-transparent"></div>
      <div className={cn('bg-error absolute bottom-1 px-2 py-1 text-sm text-white', alignment ? `errors-${alignment}` : false)}>
        {error}
      </div>
    </div>
  );
};

function isErrorVisible(error: string | undefined | null, touched: boolean, submitCount: number): boolean {
  return !!error && (touched || submitCount > 0);
}
