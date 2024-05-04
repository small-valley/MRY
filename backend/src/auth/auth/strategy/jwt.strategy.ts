import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || "secret",
    });
  }

  validate(payload: any): JwtPayload {
    return { userId: payload.userId, email: payload.email, role: payload.role };
  }
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}
