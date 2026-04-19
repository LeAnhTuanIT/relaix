import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ConversationRepository } from '../../domain/repositories/conversation.repository';
import { ConversationEntity } from '../../domain/entities/conversation.entity';
import { Conversation, ConversationDocument } from './schemas/conversation.schema';

@Injectable()
export class MongoConversationRepository extends ConversationRepository {
  constructor(
    @InjectModel(Conversation.name)
    private readonly model: Model<ConversationDocument>,
  ) {
    super();
  }

  async create(title: string): Promise<ConversationEntity> {
    const doc = await new this.model({ title }).save();
    return this.toEntity(doc);
  }

  async findAll(): Promise<ConversationEntity[]> {
    const docs = await this.model.find().sort({ updatedAt: -1 }).exec();
    return docs.map((doc) => this.toEntity(doc));
  }

  async findById(id: string): Promise<ConversationEntity | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const doc = await this.model.findById(id).exec();
    return doc ? this.toEntity(doc) : null;
  }

  async updateTitle(id: string, title: string): Promise<void> {
    await this.model.findByIdAndUpdate(id, { title }).exec();
  }

  async touch(id: string): Promise<void> {
    await this.model.findByIdAndUpdate(id, { updatedAt: new Date() }).exec();
  }

  async delete(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id).exec();
  }

  private toEntity(doc: ConversationDocument): ConversationEntity {
    return new ConversationEntity(
      (doc._id as Types.ObjectId).toHexString(),
      doc.title,
      (doc as any).createdAt,
      (doc as any).updatedAt,
    );
  }
}
