type ContentFilterResult = { filtered: boolean; severity: 'safe' | 'low' | 'medium' | 'high' };
type ContentFilterJailbreakResult = { filtered: boolean; detected: boolean };

type ContentFilterError = {
  code: 'content_filter';
  error: {
    message: string;
    param: 'prompt';
    code: 'content_filter';
    status: number;
    innererror?: {
      code: string;
      content_filter_result?: {
        hate: ContentFilterResult;
        jailbreak: ContentFilterJailbreakResult;
        self_harm: ContentFilterResult;
        sexual: ContentFilterResult;
        violence: ContentFilterResult;
      };
    };
  };
};

export function isContentFilterError(error: unknown): error is ContentFilterError {
  return (error as ContentFilterError).code === 'content_filter';
}
