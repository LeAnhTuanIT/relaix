export type MessageRole = 'user' | 'assistant';

export class MessageEntity {
  constructor(
    public readonly id: string,
    public readonly conversationId: string,
    public readonly role: MessageRole,
    public readonly content: string,
    public readonly createdAt: Date,
    public readonly fileUrl?: string,
    public readonly fileName?: string,
  ) {}
}
