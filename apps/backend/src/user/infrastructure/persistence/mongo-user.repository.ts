import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserRepository, CreateUserData } from '../../domain/repositories/user.repository';
import { UserEntity } from '../../domain/entities/user.entity';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class MongoUserRepository extends UserRepository {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {
    super();
  }

  async create(data: CreateUserData): Promise<UserEntity> {
    const created = new this.userModel(data);
    const doc = await created.save();
    return this.toEntity(doc);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const doc = await this.userModel.findOne({ email }).exec();
    return doc ? this.toEntity(doc) : null;
  }

  async findById(id: string): Promise<UserEntity | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const doc = await this.userModel.findById(id).exec();
    return doc ? this.toEntity(doc) : null;
  }

  async findByGoogleId(googleId: string): Promise<UserEntity | null> {
    const doc = await this.userModel.findOne({ googleId }).exec();
    return doc ? this.toEntity(doc) : null;
  }

  private toEntity(doc: UserDocument): UserEntity {
    return new UserEntity(
      (doc._id as Types.ObjectId).toHexString(),
      doc.email,
      doc.name,
      doc.password,
      doc.avatar,
      doc.googleId,
      doc.createdAt,
    );
  }
}
