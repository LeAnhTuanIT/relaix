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
      clientID: configService.get<string>('GOOGLE_CLIENT_ID') as string,
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET') as string,
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL') as string,
      scope: ['email', 'profile'],
    });
  }


  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any, // Profile from passport-google-oauth20 is complex, 'any' is common here
    done: VerifyCallback,
  ): Promise<void> {
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
