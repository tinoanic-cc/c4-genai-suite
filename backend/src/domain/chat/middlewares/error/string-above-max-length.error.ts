type StringAboveMaxLengthError = {
  code: 'string_above_max_length';
  error: {
    message: string;
    param: 'messages';
    code: 'string_above_max_length';
    status: number;
  };
};

export function isStringAboveMaxLengthError(error: unknown): error is StringAboveMaxLengthError {
  return (error as StringAboveMaxLengthError).code === 'string_above_max_length';
}
