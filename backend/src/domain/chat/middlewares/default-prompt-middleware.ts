import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import { Injectable } from '@nestjs/common';
import { ChatContext, ChatMiddleware, ChatNextDelegate, GetContext } from '../interfaces';
import { ExecuteMiddleware } from './execute-middleware';

@Injectable()
export class DefaultPromptMiddleware implements ChatMiddleware {
  order = ExecuteMiddleware.ORDER - 10;

  async invoke(context: ChatContext, getContext: GetContext, next: ChatNextDelegate): Promise<any> {
    if (context.prompt) {
      await next(context);
      return;
    }

    if (context.systemMessages.length === 0) {
      context.systemMessages.push(`You are a helpful assistant. Today is ${new Date().toISOString()}.`);
    }

    const messages: Parameters<typeof ChatPromptTemplate.fromMessages>[0] = [
      ...context.systemMessages.map((x) => ({
        role: 'system',
        content: x,
      })),

      new MessagesPlaceholder('chat_history'),
      ['human', '{input}'],
    ];

    if (context.tools.length) {
      messages.push(new MessagesPlaceholder('agent_scratchpad'));
    }

    context.prompt = ChatPromptTemplate.fromMessages(messages);
    await next(context);
  }
}
