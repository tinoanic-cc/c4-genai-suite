import { Injectable } from '@nestjs/common';
import { ChatContext, ChatMiddleware, ChatNextDelegate, ChatUI, GetContext } from '../interfaces';
import { CallbackService } from '../services/callback-service';

@Injectable()
export class UIMiddleware implements ChatMiddleware {
  order = -1000;

  constructor(private readonly callbacks: CallbackService) {}

  invoke(context: ChatContext, getContext: GetContext, next: ChatNextDelegate): Promise<any> {
    context.ui = new ChatUIImpl(context, this.callbacks);
    return next(context);
  }
}

class ChatUIImpl implements ChatUI {
  constructor(
    private readonly context: ChatContext,
    private readonly callbacks: CallbackService,
  ) {}

  confirm(text: string): Promise<boolean> {
    const { id, result } = this.callbacks.confirm();

    this.context.result.next({
      type: 'ui',
      request: { id, text, type: 'boolean' },
    });

    return result;
  }

  input(text: string): Promise<string> {
    const { id, result } = this.callbacks.input();

    this.context.result.next({
      type: 'ui',
      request: { id, text, type: 'string' },
    });

    return result;
  }
}
