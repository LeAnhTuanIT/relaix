import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './infrastructure/persistence/schemas/user.schema';
import { UserRepository } from './domain/repositories/user.repository';
import { MongoUserRepository } from './infrastructure/persistence/mongo-user.repository';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [
    { provide: UserRepository, useClass: MongoUserRepository },
    UserService,
  ],
  exports: [UserRepository, UserService],
})
export class UserModule {}
