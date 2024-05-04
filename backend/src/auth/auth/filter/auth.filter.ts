import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { Response } from "express";

@Catch()
export class AuthExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    console.error(exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // Redirect frontend page to handle error
    response.redirect(`${process.env.FRONT_AUTH_REDIRECT_URL}?error=${exception.message}`);
  }
}
