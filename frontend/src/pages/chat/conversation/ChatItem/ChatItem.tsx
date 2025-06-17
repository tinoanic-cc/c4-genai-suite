import { AIChatItem } from './AIChatItem';
import { ChatItemProps } from './ChatItemProps';
import { HumanChatItem } from './HumanChatItem';

export const ChatItem = (props: ChatItemProps) => {
  return props.message.type === 'ai' ? <AIChatItem {...props} /> : <HumanChatItem {...props} />;
};
