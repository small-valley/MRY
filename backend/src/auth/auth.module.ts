import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core/constants";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { RepositoryModule } from "src/repository/repository.module";
import { AuthController } from "./auth/auth.controller";
import { AuthService } from "./auth/auth.service";
import { JwtAuthGuard } from "./auth/guard/jwt-auth.guard";
import { GoogleStrategy } from "./auth/strategy/google.strategy";
import { JwtStrategy } from "./auth/strategy/jwt.strategy";
import { LocalStrategy } from "./auth/strategy/local.strategy";

@Module({
  imports: [
    RepositoryModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || "secret",
      signOptions: { expiresIn: process.env.JWT_EXPIRATION || "12h" },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    GoogleStrategy,
    // Make JwtAuthGuard as global.
    // If some controllers are not supposed to be protected, add @Public() decorator to them.
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AuthModule {}
