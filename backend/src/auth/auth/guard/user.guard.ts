import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class UserAuthGuard extends AuthGuard("jwt") {
  handleRequest(err, user, info: Error) {
    // to populate req.user
    return user;
  }
}
