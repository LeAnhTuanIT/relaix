import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Conversation, ConversationDocument } from './schemas/conversation.schema';
import { Message, MessageDocument } from './schemas/message.schema';
import { SendMessageDto } from './dto/send-message.dto';
import { CreateConversationDto } from './dto/create-conversation.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<ConversationDocument>,
    @InjectModel(Message.name)
    private messageModel: Model<MessageDocument>,
  ) {}

  async createConversation(dto: CreateConversationDto): Promise<ConversationDocument> {
    const conversation = new this.conversationModel({
      title: dto.title || 'New Conversation',
    });
    return conversation.save();
  }

  async getConversations(): Promise<ConversationDocument[]> {
    return this.conversationModel.find().sort({ updatedAt: -1 }).exec();
  }

  async getMessages(conversationId: string): Promise<MessageDocument[]> {
    if (!Types.ObjectId.isValid(conversationId)) {
      throw new NotFoundException('Conversation not found');
    }
    return this.messageModel
      .find({ conversationId: new Types.ObjectId(conversationId) })
      .sort({ createdAt: 1 })
      .exec();
  }

  async sendMessage(conversationId: string, dto: SendMessageDto): Promise<MessageDocument[]> {
    if (!Types.ObjectId.isValid(conversationId)) {
      throw new NotFoundException('Conversation not found');
    }

    const convObjectId = new Types.ObjectId(conversationId);

    const conversation = await this.conversationModel.findById(convObjectId);
    if (!conversation) throw new NotFoundException('Conversation not found');

    // Save user message
    const userMessage = await new this.messageModel({
      conversationId: convObjectId,
      role: 'user',
      content: dto.content,
      fileUrl: dto.fileUrl,
      fileName: dto.fileName,
    }).save();

    // Mock AI response
    const aiContent = this.generateAiResponse(dto.content);
    const aiMessage = await new this.messageModel({
      conversationId: convObjectId,
      role: 'assistant',
      content: aiContent,
    }).save();

    // Update conversation title on first message
    const messageCount = await this.messageModel.countDocuments({ conversationId: convObjectId });
    if (messageCount <= 2) {
      const title = dto.content.length > 50 ? dto.content.slice(0, 50) + '...' : dto.content;
      await this.conversationModel.findByIdAndUpdate(convObjectId, { title });
    } else {
      await this.conversationModel.findByIdAndUpdate(convObjectId, { updatedAt: new Date() });
    }

    return [userMessage, aiMessage];
  }

  async deleteConversation(conversationId: string): Promise<void> {
    if (!Types.ObjectId.isValid(conversationId)) {
      throw new NotFoundException('Conversation not found');
    }
    const convObjectId = new Types.ObjectId(conversationId);
    await this.conversationModel.findByIdAndDelete(convObjectId);
    await this.messageModel.deleteMany({ conversationId: convObjectId });
  }

  private generateAiResponse(userContent: string): string {
    const responses = [
      `Tôi hiểu bạn đang nói về "${userContent.slice(0, 30)}...". Đây là một chủ đề thú vị! Hãy để tôi phân tích thêm.`,
      `Cảm ơn bạn đã chia sẻ. Dựa trên nội dung của bạn, tôi có thể gợi ý rằng: ${userContent.split(' ').slice(0, 5).join(' ')} là một điểm quan trọng cần xem xét.`,
      `Đó là một câu hỏi hay! Tôi nghĩ chúng ta có thể tiếp cận vấn đề này từ nhiều góc độ khác nhau.`,
      `Tôi đã xem xét yêu cầu của bạn. Theo tôi, cách tốt nhất để giải quyết vấn đề này là phân tích từng bước một cách cẩn thận.`,
      `Thật thú vị! Tôi sẽ giúp bạn khám phá chủ đề này sâu hơn. Có điểm nào cụ thể bạn muốn tìm hiểu thêm không?`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
}
