import { Injectable } from '@nestjs/common';
import { ConversationRepository } from '../../domain/repositories/conversation.repository';
import { ConversationEntity } from '../../domain/entities/conversation.entity';

export class CreateConversationDto {
  title?: string;
}

@Injectable()
export class CreateConversationUseCase {
  constructor(private readonly conversationRepo: ConversationRepository) {}

  async execute(dto: CreateConversationDto): Promise<ConversationEntity> {
    return this.conversationRepo.create(dto.title ?? 'New Conversation');
  }
}
