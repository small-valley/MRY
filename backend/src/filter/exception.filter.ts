import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, UnauthorizedException } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { BadRequestError } from "src/error/badRequest.error";
import { NotFoundError } from "src/error/notFound.error";
import { BaseResponse } from "../../../shared/models/responses/baseResponse";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: Error, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    let httpStatus = 0;

    switch (exception.constructor) {
      case BadRequestError:
        httpStatus = HttpStatus.BAD_REQUEST;
        break;
      case NotFoundError:
        httpStatus = HttpStatus.NOT_FOUND;
        break;
      case UnauthorizedException:
        httpStatus = HttpStatus.UNAUTHORIZED;
        break;
      default:
        httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        break;
    }

    console.error(exception);

    const responseBody: BaseResponse<null> = {
      data: null,
      hasError: true,
      statusCode: httpStatus,
      message: exception.message,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
