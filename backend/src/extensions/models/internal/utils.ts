import { CallbackHandlerMethods } from '@langchain/core/callbacks/base';
import { MessageContentComplex, MessageContentText } from '@langchain/core/messages';
import { GetContext } from 'src/domain/chat';
import { isString } from 'src/lib';

function isMessageContentText(messageContent: MessageContentComplex): messageContent is MessageContentText {
  return messageContent.type === 'text';
}

export function getEstimatedUsageCallback(llm: string, model: string, getContext: GetContext): CallbackHandlerMethods {
  return {
    handleChatModelStart(_, messages) {
      const context = getContext();

      let totalLength = 0;
      for (const block of messages) {
        for (const message of block) {
          if (isString(message.content)) {
            totalLength += message.content.length;
          } else {
            for (const part of message.content) {
              if (isMessageContentText(part)) {
                totalLength += part.text.length;
              } else if (part.type === 'image_url') {
                if (isString(part.image_url)) {
                  totalLength += part.image_url.length;
                } else {
                  totalLength += (part.image_url as { url: string }).url.length;
                }
              }
            }
          }
        }
      }

      // Fallback to approximate calculation if tiktoken is not available
      const tokenCount = Math.ceil(totalLength / 4);

      context.tokenUsage ??= { tokenCount, model, llm };
      context.tokenUsage.tokenCount += tokenCount;
    },
    handleLLMEnd(output) {
      const context = getContext();

      let totalLength = 0;
      for (const block of output.generations) {
        for (const message of block) {
          if (isString(message.text)) {
            totalLength += message.text.length;
          }
        }
      }

      // Fallback to approximate calculation if tiktoken is not available
      const tokenCount = Math.ceil(totalLength / 4);

      context.tokenUsage ??= { tokenCount, model, llm };
      context.tokenUsage.tokenCount += tokenCount;
    },
  };
}
