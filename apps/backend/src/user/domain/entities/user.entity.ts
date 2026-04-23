export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string,
    public readonly password?: string,
    public readonly avatar?: string,
    public readonly googleId?: string,
    public readonly createdAt?: Date,
  ) {}
}
