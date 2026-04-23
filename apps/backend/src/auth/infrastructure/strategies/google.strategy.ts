import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../../user/user.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID') || 'dummy_id',
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET') || 'dummy_secret',
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL') || 'http://localhost:3001/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, emails, displayName, photos } = profile;
    const email = emails[0].value;

    let user = await this.userService.findByGoogleId(id);
    if (!user) {
      user = await this.userService.findByEmail(email);
    }

    if (!user) {
      user = await this.userService.create({
        email,
        name: displayName,
        googleId: id,
        avatar: photos[0]?.value,
      });
    }

    done(null, user);
  }
}
