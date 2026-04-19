import { Injectable, NotFoundException } from '@nestjs/common';
import { ConversationRepository } from '../../domain/repositories/conversation.repository';
import { MessageRepository } from '../../domain/repositories/message.repository';

@Injectable()
export class DeleteConversationUseCase {
  constructor(
    private readonly conversationRepo: ConversationRepository,
    private readonly messageRepo: MessageRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const conv = await this.conversationRepo.findById(id);
    if (!conv) throw new NotFoundException('Conversation not found');
    await this.messageRepo.deleteByConversationId(id);
    await this.conversationRepo.delete(id);
  }
}
