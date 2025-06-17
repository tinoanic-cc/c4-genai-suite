type FailedToolUseError = {
  message: string;
  output: string;
  stack: string;
};

export function isFailedToolUseError(error: unknown): error is FailedToolUseError {
  return (error as FailedToolUseError).message === 'Received tool input did not match expected schema';
}
