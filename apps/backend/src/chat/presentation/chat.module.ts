import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatController } from './chat.controller';
import { CreateConversationUseCase } from '../application/use-cases/create-conversation.use-case';
import { GetConversationsUseCase } from '../application/use-cases/get-conversations.use-case';
import { DeleteConversationUseCase } from '../application/use-cases/delete-conversation.use-case';
import { GetMessagesUseCase } from '../application/use-cases/get-messages.use-case';
import { SendMessageUseCase } from '../application/use-cases/send-message.use-case';
import { StreamMessageUseCase } from '../application/use-cases/stream-message.use-case';
import { ConversationRepository } from '../domain/repositories/conversation.repository';
import { MessageRepository } from '../domain/repositories/message.repository';
import { AiProviderPort } from '../domain/ports/ai-provider.port';
import { MongoConversationRepository } from '../infrastructure/persistence/mongo-conversation.repository';
import { MongoMessageRepository } from '../infrastructure/persistence/mongo-message.repository';
import { VercelAiAdapter } from '../infrastructure/ai/vercel-ai.adapter';
import {
  Conversation,
  ConversationSchema,
} from '../infrastructure/persistence/schemas/conversation.schema';
import { Message, MessageSchema } from '../infrastructure/persistence/schemas/message.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
  ],
  controllers: [ChatController],
  providers: [
    CreateConversationUseCase,
    GetConversationsUseCase,
    DeleteConversationUseCase,
    GetMessagesUseCase,
    SendMessageUseCase,
    StreamMessageUseCase,
    { provide: ConversationRepository, useClass: MongoConversationRepository },
    { provide: MessageRepository, useClass: MongoMessageRepository },
    { provide: AiProviderPort, useClass: VercelAiAdapter },
  ],
})
export class ChatModule {}
