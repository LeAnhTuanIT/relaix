import { Injectable, NotFoundException } from '@nestjs/common';
import { ConversationRepository } from '../../domain/repositories/conversation.repository';
import { MessageRepository } from '../../domain/repositories/message.repository';
import { MessageEntity } from '../../domain/entities/message.entity';

@Injectable()
export class GetMessagesUseCase {
  constructor(
    private readonly conversationRepo: ConversationRepository,
    private readonly messageRepo: MessageRepository,
  ) {}

  async execute(conversationId: string): Promise<MessageEntity[]> {
    const conv = await this.conversationRepo.findById(conversationId);
    if (!conv) throw new NotFoundException('Conversation not found');
    return this.messageRepo.findByConversationId(conversationId);
  }
}
