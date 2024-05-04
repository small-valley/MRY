import { Controller, Get, Param, Post, UploadedFile, UseInterceptors} from "@nestjs/common";
import { ApiTags, ApiConsumes, ApiBody } from "@nestjs/swagger";
import { AppController } from "src/app.controller";
import { UserService } from "./user.service";
import { S3Service } from "../s3/s3.service";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("users")
@ApiTags("users")
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
}
