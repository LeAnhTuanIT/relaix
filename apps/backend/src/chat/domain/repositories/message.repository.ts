import { MessageEntity, MessageRole } from '../entities/message.entity';

export interface CreateMessageData {
  conversationId: string;
  role: MessageRole;
  content: string;
  fileUrl?: string;
  fileName?: string;
}

export abstract class MessageRepository {
  abstract create(data: CreateMessageData): Promise<MessageEntity>;
  abstract findByConversationId(conversationId: string): Promise<MessageEntity[]>;
  abstract countByConversationId(conversationId: string): Promise<number>;
  abstract deleteByConversationId(conversationId: string): Promise<void>;
}
