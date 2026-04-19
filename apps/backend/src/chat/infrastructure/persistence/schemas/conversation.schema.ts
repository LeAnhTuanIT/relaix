import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ConversationDocument = Conversation & Document & { createdAt: Date; updatedAt: Date };

@Schema({ timestamps: true })
export class Conversation {
  @Prop({ required: true, default: 'New Conversation' })
  title: string;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
