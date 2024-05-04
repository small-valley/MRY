import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { OauthUserModel } from "src/repository/models/user.model";
import { AuthService } from "../auth.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_OAUTH_CALLBACK_URL,
      scope: ["email", "profile"],
      passReqToCallback: true,
    });
  }

  async validate(
    req: any,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback
  ): Promise<any> {
    const googleUser = {
      email: profile.emails[0].value,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      avatarUrl: profile.photos[0].value,
    } as OauthUserModel;
    const user = await this.authService.validateGoogleUser(googleUser);
    done(null, user);
  }
}
