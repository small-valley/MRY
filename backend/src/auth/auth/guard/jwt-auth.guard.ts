import { ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { IUserRepository } from "src/repository/interfaces/IUserRepository";
import { AuthService } from "../auth.service";
import { IS_PUBLIC_KEY } from "../decorator/public.decorator";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  @Inject(AuthService)
  private readonly authService: AuthService;
  @Inject("userRepository")
  private readonly userRepository: IUserRepository;
  @Inject(Reflector)
  private readonly reflector: Reflector;

  constructor() {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    // This method checks access token stored in memory.
    // If this backend is deployed to serverless environment, token validation should be done with stored value in other place.
    //return super.canActivate(context);

    const request = context.switchToHttp().getRequest();
    // Extract token from Authorization header
    const token = request.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new UnauthorizedException("Token not found");
    }

    // Decode token
    const decodedToken = this.authService.decodeToken(token);
    // Get stored token from database
    const user = await this.userRepository.getUserById(decodedToken.userId);

    if (user.accessToken !== token) {
      throw new UnauthorizedException("Invalid token");
    }

    return true;
  }
}
