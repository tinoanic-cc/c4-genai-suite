type ContextLengthExceededError = {
  code: 'context_length_exceeded';
  error: {
    message: string;
    param: 'messages';
    code: 'context_length_exceeded';
    status: number;
  };
};

export function isContextLengthExceededError(error: unknown): error is ContextLengthExceededError {
  return (error as ContextLengthExceededError).code === 'context_length_exceeded';
}
