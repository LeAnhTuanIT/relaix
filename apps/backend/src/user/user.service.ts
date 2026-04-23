import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRepository, CreateUserData } from './domain/repositories/user.repository';
import { UserEntity } from './domain/entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(data: CreateUserData): Promise<UserEntity> {
    const hashedPassword = data.password ? await bcrypt.hash(data.password, 10) : undefined;
    return this.userRepository.create({
      ...data,
      password: hashedPassword,
    });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findByEmail(email);
  }

  async findById(id: string): Promise<UserEntity | null> {
    return this.userRepository.findById(id);
  }

  async findByGoogleId(googleId: string): Promise<UserEntity | null> {
    return this.userRepository.findByGoogleId(googleId);
  }
}
