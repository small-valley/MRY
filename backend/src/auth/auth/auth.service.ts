import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import bcrypt from "bcrypt";
import { BadRequestError } from "src/error/badRequest.error";
import { IUserRepository } from "src/repository/interfaces/IUserRepository";
import { OauthUserModel, UserAuthenticationModel } from "src/repository/models/user.model";
import { SignupDto } from "./dto/auth.dto";
import { JwtPayload } from "./strategy/jwt.strategy";

@Injectable()
export class AuthService {
  @Inject("userRepository")
  private readonly userRepository: IUserRepository;
  @Inject(JwtService)
  private readonly jwtService: JwtService;

  async validateUser(email: string, password: string): Promise<Omit<UserAuthenticationModel, "password"> | null> {
    const user = await this.userRepository.getLocalUserByEmail(email);
    if (user.userId) {
      const isMatch = await this.compareHashedPassword(password, user.password);
      if (isMatch) {
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async signin(userId: string, email: string, role: string) {
    const accessToken = this.jwtService.sign({ email: email, userId: userId, role: role });
    await this.userRepository.saveAccessToken(userId, accessToken);
    return accessToken;
  }

  async signup(request: SignupDto) {
    const existingUser = await this.userRepository.getLocalUserByEmail(request.email);
    if (existingUser.userId) {
      throw new BadRequestError("User with the same email already exists");
    }
    const hashedPassword = await this.hashPassword(request.password);
    const user = await this.userRepository.createLocalUser(
      request.email,
      hashedPassword,
      request.firstName,
      request.lastName
    );
    return user;
  }

  async logout(userId: string) {
    await this.userRepository.deleteAccessToken(userId);
  }

  async validateGoogleUser(googleUser: OauthUserModel): Promise<JwtPayload | null> {
    const user = await this.userRepository.upsertOauthUser(googleUser);
    return { userId: user.userId, email: user.email, role: user.role };
  }

  decodeToken(token: string) {
    try {
      return this.jwtService.verify<JwtPayload>(token);
    } catch (error) {
      // Handle decoding errors, such as token expiration or invalid signature
      throw new Error("Invalid token. Please sign in again.");
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  private async compareHashedPassword(data: string | Buffer, encrypted: string): Promise<boolean> {
    return bcrypt.compare(data, encrypted);
  }
}
