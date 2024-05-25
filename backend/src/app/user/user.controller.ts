import { Controller, Get, Param, Post, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { AppController } from "src/app/app.controller";
import { UserAuthGuard } from "src/auth/auth/guard/user.guard";
import { BaseResponse } from "../../../../shared/models/responses/baseResponse";
import { GetLoginUserResponse } from "../../../../shared/models/responses/getLoginUserResponse";
import { S3Service } from "../s3/s3.service";
import { UserService } from "./user.service";

@Controller("users")
@ApiTags("users")
@ApiBearerAuth("JWT")
export class UserController extends AppController {
  constructor(
    private readonly userService: UserService,
    private readonly s3Service: S3Service
  ) {
    super();
  }

  @Get()
  async getUsers() {
    const result = await this.userService.getUsers();
    return this.ok(result);
  }

  @Get("/managers")
  async getManagers() {
    const result = await this.userService.getManagers();
    return this.ok(result);
  }

  @Get("/:userId")
  async getUser(@Param("userId") userId: string) {
    const result = await this.userService.getUser(userId);
    return this.ok(result);
  }

  @Post("/:userId/avatar")
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor("file"))
  async uploadAvatar(@UploadedFile() file: Express.Multer.File, @Param("userId") userId: string) {
    const avatarUrl = await this.s3Service.uploadImage(file.buffer, userId);

    await this.userService.updateUserAvatar(userId, avatarUrl);

    return this.ok({ avatarUrl });
  }

  @UseGuards(UserAuthGuard) // get userId from jwt token
  @Get("login/user")
  async getLoginUser(@Req() req): Promise<BaseResponse<GetLoginUserResponse>> {
    const result = await this.userService.getLoginUser(req.user.userId);
    return this.ok(result);
  }
}
