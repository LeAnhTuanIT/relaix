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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { Response } from 'express';
import { CreateConversationUseCase } from '../application/use-cases/create-conversation.use-case';
import { GetConversationsUseCase } from '../application/use-cases/get-conversations.use-case';
import { DeleteConversationUseCase } from '../application/use-cases/delete-conversation.use-case';
import { GetMessagesUseCase } from '../application/use-cases/get-messages.use-case';
import { SendMessageUseCase } from '../application/use-cases/send-message.use-case';
import { StreamMessageUseCase } from '../application/use-cases/stream-message.use-case';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { MessageEntity } from '../domain/entities/message.entity';

const UPLOAD_DIR = join(process.cwd(), 'uploads');

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

@Controller('chat')
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
  createConversation(@Body() dto: CreateConversationDto) {
    return this.createConversationUseCase.execute(dto);
  }

  @Get('conversations')
  getConversations() {
    return this.getConversationsUseCase.execute();
  }

  @Delete('conversations/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteConversation(@Param('id') id: string) {
    return this.deleteConversationUseCase.execute(id);
  }

  @Get('conversations/:id/messages')
  getMessages(@Param('id') id: string) {
    return this.getMessagesUseCase.execute(id);
  }

  @Post('conversations/:id/messages')
  sendMessage(@Param('id') id: string, @Body() dto: SendMessageDto) {
    return this.sendMessageUseCase.execute(id, dto);
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

      const aiMessage = await commit(fullText);
      send({ type: 'done', message: toMessageDto(aiMessage) });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Stream error';
      send({ type: 'error', message });
    } finally {
      res.end();
    }
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          if (!existsSync(UPLOAD_DIR)) mkdirSync(UPLOAD_DIR, { recursive: true });
          cb(null, UPLOAD_DIR);
        },
        filename: (_req, file, cb) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) return { fileUrl: null, fileName: null };

    const baseUrl = process.env.API_URL || `http://localhost:${process.env.PORT || 3001}`;
    return {
      fileUrl: `${baseUrl}/uploads/${file.filename}`,
      fileName: file.originalname,
    };
  }
}
