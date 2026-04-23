import { Injectable, NotFoundException } from '@nestjs/common';
import { ConversationRepository } from '../../domain/repositories/conversation.repository';
import { MessageRepository } from '../../domain/repositories/message.repository';
import { AiProviderPort, AiMessage } from '../../domain/ports/ai-provider.port';
import { MessageEntity } from '../../domain/entities/message.entity';

export class StreamMessageDto {
  content: string;
  fileUrl?: string;
  fileName?: string;
  model?: string;
}

@Injectable()
export class StreamMessageUseCase {
  constructor(
    private readonly conversationRepo: ConversationRepository,
    private readonly messageRepo: MessageRepository,
    private readonly aiProvider: AiProviderPort,
  ) {}

  async execute(conversationId: string, dto: StreamMessageDto): Promise<{
    userMessage: MessageEntity;
    textStream: AsyncIterable<string>;
    commit: (fullText: string) => Promise<MessageEntity>;
  }> {
    const conv = await this.conversationRepo.findById(conversationId);
    if (!conv) throw new NotFoundException('Conversation not found');

    // 1. Lấy lịch sử tin nhắn trước đó
    const previousMessages = await this.messageRepo.findByConversationId(conversationId);
    
    // 2. Tạo tin nhắn mới của người dùng
    const userMessage = await this.messageRepo.create({
      conversationId,
      role: 'user',
      content: dto.content,
      fileUrl: dto.fileUrl,
      fileName: dto.fileName,
    });

    // 3. Chuẩn bị history cho AI Provider
    const history: AiMessage[] = [
      ...previousMessages.map(msg => ({
        role: msg.role,
        content: msg.content,
        attachment: msg.fileUrl ? { url: msg.fileUrl, name: msg.fileName } : undefined,
      })),
      {
        role: 'user',
        content: dto.content,
        attachment: dto.fileUrl ? { url: dto.fileUrl, name: dto.fileName } : undefined,
      }
    ];

    const textStream = this.aiProvider.streamResponse(history, dto.model);

    const commit = async (fullText: string): Promise<MessageEntity> => {
      const aiMessage = await this.messageRepo.create({
        conversationId,
        role: 'assistant',
        content: fullText,
      });
      const count = await this.messageRepo.countByConversationId(conversationId);
      if (count <= 2) {
        const title = dto.content.length > 50 ? dto.content.slice(0, 50) + '...' : dto.content;
        await this.conversationRepo.updateTitle(conversationId, title);
      } else {
        await this.conversationRepo.touch(conversationId);
      }
      return aiMessage;
    };

    return { userMessage, textStream, commit };
  }
}
