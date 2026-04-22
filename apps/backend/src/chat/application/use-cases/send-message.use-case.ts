import { Injectable, NotFoundException } from '@nestjs/common';
import { ConversationRepository } from '../../domain/repositories/conversation.repository';
import { MessageRepository } from '../../domain/repositories/message.repository';
import { AiProviderPort } from '../../domain/ports/ai-provider.port';
import { MessageEntity } from '../../domain/entities/message.entity';

export class SendMessageDto {
  content: string;
  fileUrl?: string;
  fileName?: string;
  model?: string;
}

@Injectable()
export class SendMessageUseCase {
  constructor(
    private readonly conversationRepo: ConversationRepository,
    private readonly messageRepo: MessageRepository,
    private readonly aiProvider: AiProviderPort,
  ) {}

  async execute(conversationId: string, dto: SendMessageDto): Promise<MessageEntity[]> {
    const conv = await this.conversationRepo.findById(conversationId);
    if (!conv) throw new NotFoundException('Conversation not found');

    const userMessage = await this.messageRepo.create({
      conversationId,
      role: 'user',
      content: dto.content,
      fileUrl: dto.fileUrl,
      fileName: dto.fileName,
    });

    const aiContent = await this.aiProvider.generateResponse(
      dto.content,
      userMessage.fileUrl ? { url: userMessage.fileUrl, name: userMessage.fileName } : undefined,
      dto.model,
    );
    const aiMessage = await this.messageRepo.create({
      conversationId,
      role: 'assistant',
      content: aiContent,
    });

    const count = await this.messageRepo.countByConversationId(conversationId);
    if (count <= 2) {
      const title = dto.content.length > 50 ? dto.content.slice(0, 50) + '...' : dto.content;
      await this.conversationRepo.updateTitle(conversationId, title);
    } else {
      await this.conversationRepo.touch(conversationId);
    }

    return [userMessage, aiMessage];
  }
}
