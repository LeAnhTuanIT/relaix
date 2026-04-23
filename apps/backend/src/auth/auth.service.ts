import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../../user/domain/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async generateToken(user: UserEntity) {
    const payload = { email: user.email, sub: user.id };
    return this.jwtService.sign(payload);
  }
}
