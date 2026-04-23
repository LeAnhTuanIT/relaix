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
    profile: unknown,
    done: VerifyCallback,
  ): Promise<void> {
    const googleProfile = profile as {
      id: string;
      emails: { value: string }[];
      displayName: string;
      photos: { value: string }[];
    };
    const { id, emails, displayName, photos } = googleProfile;
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
