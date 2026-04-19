import { Injectable } from '@nestjs/common';
import { ConversationRepository } from '../../domain/repositories/conversation.repository';
import { ConversationEntity } from '../../domain/entities/conversation.entity';

@Injectable()
export class GetConversationsUseCase {
  constructor(private readonly conversationRepo: ConversationRepository) {}

  async execute(): Promise<ConversationEntity[]> {
    return this.conversationRepo.findAll();
  }
}
