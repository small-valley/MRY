import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { UserAuthenticationModel } from "src/repository/models/user.model";
import { AuthService } from "../auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: "email" });
  }

  async validate(email: string, password: string): Promise<Omit<UserAuthenticationModel, "password"> | null> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException("Email and Password didn't match. Please try again.");
    }
    return user;
  }
}
