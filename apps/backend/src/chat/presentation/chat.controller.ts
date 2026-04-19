import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { CreateConversationUseCase } from '../application/use-cases/create-conversation.use-case';
import { GetConversationsUseCase } from '../application/use-cases/get-conversations.use-case';
import { DeleteConversationUseCase } from '../application/use-cases/delete-conversation.use-case';
import { GetMessagesUseCase } from '../application/use-cases/get-messages.use-case';
import { SendMessageUseCase } from '../application/use-cases/send-message.use-case';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { SendMessageDto } from './dto/send-message.dto';

const UPLOAD_DIR = join(process.cwd(), 'uploads');

@Controller('chat')
export class ChatController {
  constructor(
    private readonly createConversationUseCase: CreateConversationUseCase,
    private readonly getConversationsUseCase: GetConversationsUseCase,
    private readonly deleteConversationUseCase: DeleteConversationUseCase,
    private readonly getMessagesUseCase: GetMessagesUseCase,
    private readonly sendMessageUseCase: SendMessageUseCase,
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
