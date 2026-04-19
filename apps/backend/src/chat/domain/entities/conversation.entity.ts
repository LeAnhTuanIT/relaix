export class ConversationEntity {
  constructor(
    public readonly id: string,
    public title: string,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}
}
