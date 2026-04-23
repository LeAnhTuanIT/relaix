import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { Response } from 'express';
import { JwtAuthGuard } from '../../auth/infrastructure/guards/jwt-auth.guard';
import { CreateConversationUseCase } from '../application/use-cases/create-conversation.use-case';
import { GetConversationsUseCase } from '../application/use-cases/get-conversations.use-case';
import { DeleteConversationUseCase } from '../application/use-cases/delete-conversation.use-case';
import { GetMessagesUseCase } from '../application/use-cases/get-messages.use-case';
import { SendMessageUseCase } from '../application/use-cases/send-message.use-case';
import { StreamMessageUseCase } from '../application/use-cases/stream-message.use-case';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { MessageEntity } from '../domain/entities/message.entity';
import { ConversationEntity } from '../domain/entities/conversation.entity';

// Configure Cloudinary instance
const cloudinaryInstance = cloudinary;
cloudinaryInstance.config({
  cloud_name: 'dp5v0qf0s',
  api_key: '163448959224664',
  api_secret: '9aR7X7Xv3pY8Hz-14iDG6zfljvA',
});

function toMessageDto(msg: MessageEntity) {
  return {
    _id: msg.id,
    conversationId: msg.conversationId,
    role: msg.role,
    content: msg.content,
    fileUrl: msg.fileUrl,
    fileName: msg.fileName,
    createdAt: msg.createdAt,
  };
}

function toConversationDto(conv: ConversationEntity) {
  return {
    _id: conv.id,
    title: conv.title,
    createdAt: conv.createdAt,
    updatedAt: conv.updatedAt,
  };
}

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(
    private readonly createConversationUseCase: CreateConversationUseCase,
    private readonly getConversationsUseCase: GetConversationsUseCase,
    private readonly deleteConversationUseCase: DeleteConversationUseCase,
    private readonly getMessagesUseCase: GetMessagesUseCase,
    private readonly sendMessageUseCase: SendMessageUseCase,
    private readonly streamMessageUseCase: StreamMessageUseCase,
  ) {}

  @Post('conversations')
  async createConversation(@Body() dto: CreateConversationDto) {
    const conv = await this.createConversationUseCase.execute(dto);
    return toConversationDto(conv);
  }

  @Get('conversations')
  async getConversations() {
    const convs = await this.getConversationsUseCase.execute();
    return convs.map(toConversationDto);
  }

  @Delete('conversations/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteConversation(@Param('id') id: string) {
    return this.deleteConversationUseCase.execute(id);
  }

  @Get('conversations/:id/messages')
  async getMessages(@Param('id') id: string) {
    const messages = await this.getMessagesUseCase.execute(id);
    return messages.map(toMessageDto);
  }

  @Post('conversations/:id/messages')
  async sendMessage(@Param('id') id: string, @Body() dto: SendMessageDto) {
    const messages = await this.sendMessageUseCase.execute(id, dto);
    return messages.map(toMessageDto);
  }

  @Post('conversations/:id/messages/stream')
  async streamMessage(
    @Param('id') id: string,
    @Body() dto: SendMessageDto,
    @Res() res: Response,
  ) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    const send = (data: object) => res.write(`data: ${JSON.stringify(data)}\n\n`);

    try {
      const { userMessage, textStream, commit } = await this.streamMessageUseCase.execute(id, dto);

      send({ type: 'user_message', message: toMessageDto(userMessage) });

      let fullText = '';
      for await (const chunk of textStream) {
        fullText += chunk;
        send({ type: 'chunk', text: chunk });
      }

      if (!fullText.trim()) {
        throw new Error('AI không trả về dữ liệu. Có thể do hết Quota hoặc Model không hỗ trợ Region này.');
      }

      const aiMessage = await commit(fullText);
      send({ type: 'done', message: toMessageDto(aiMessage) });
    } catch (err: unknown) {
      console.error('Stream error:', err);
      const error = err as Error & { data?: { error?: { message?: string } } };
      const message = error.message || error.data?.error?.message || 'AI Provider Error';
      send({ type: 'error', message: `AI Error: ${message}` });
    } finally {
      res.end();
    }
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
      storage: new CloudinaryStorage({
        cloudinary: cloudinaryInstance,
        params: {
          folder: 'relaix-chat',
          allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp', 'pdf', 'txt', 'docx'],
          resource_type: 'auto',
        } as Record<string, unknown>,
      }),
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) return { fileUrl: null, fileName: null };

    const cloudFile = file as Express.Multer.File & { path?: string; secure_url?: string };
    return {
      fileUrl: cloudFile.path || cloudFile.secure_url,
      fileName: cloudFile.originalname,
    };
  }
}
