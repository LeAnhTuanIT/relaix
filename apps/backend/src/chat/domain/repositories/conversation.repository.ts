import { ConversationEntity } from '../entities/conversation.entity';

export abstract class ConversationRepository {
  abstract create(title: string): Promise<ConversationEntity>;
  abstract findAll(): Promise<ConversationEntity[]>;
  abstract findById(id: string): Promise<ConversationEntity | null>;
  abstract updateTitle(id: string, title: string): Promise<void>;
  abstract touch(id: string): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
