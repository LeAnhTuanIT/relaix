import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MessageRepository, CreateMessageData } from '../../domain/repositories/message.repository';
import { MessageEntity } from '../../domain/entities/message.entity';
import { Message, MessageDocument } from './schemas/message.schema';

@Injectable()
export class MongoMessageRepository extends MessageRepository {
  constructor(
    @InjectModel(Message.name)
    private readonly model: Model<MessageDocument>,
  ) {
    super();
  }

  async create(data: CreateMessageData): Promise<MessageEntity> {
    const doc = await new this.model({
      conversationId: new Types.ObjectId(data.conversationId),
      role: data.role,
      content: data.content,
      fileUrl: data.fileUrl,
      fileName: data.fileName,
    }).save();
    return this.toEntity(doc);
  }

  async findByConversationId(conversationId: string): Promise<MessageEntity[]> {
    const docs = await this.model
      .find({ conversationId: new Types.ObjectId(conversationId) })
      .sort({ createdAt: 1 })
      .exec();
    return docs.map((doc) => this.toEntity(doc));
  }

  async countByConversationId(conversationId: string): Promise<number> {
    return this.model.countDocuments({ conversationId: new Types.ObjectId(conversationId) });
  }

  async deleteByConversationId(conversationId: string): Promise<void> {
    await this.model.deleteMany({ conversationId: new Types.ObjectId(conversationId) }).exec();
  }

  private toEntity(doc: MessageDocument): MessageEntity {
    return new MessageEntity(
      (doc._id as Types.ObjectId).toHexString(),
      (doc.conversationId as Types.ObjectId).toHexString(),
      doc.role,
      doc.content,
      doc.createdAt,
      doc.fileUrl,
      doc.fileName,
    );
  }
}
