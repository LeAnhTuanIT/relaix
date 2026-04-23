import { UserEntity } from '../entities/user.entity';

export interface CreateUserData {
  email: string;
  name: string;
  password?: string;
  avatar?: string;
  googleId?: string;
}

export abstract class UserRepository {
  abstract create(data: CreateUserData): Promise<UserEntity>;
  abstract findByEmail(email: string): Promise<UserEntity | null>;
  abstract findById(id: string): Promise<UserEntity | null>;
  abstract findByGoogleId(googleId: string): Promise<UserEntity | null>;
}
