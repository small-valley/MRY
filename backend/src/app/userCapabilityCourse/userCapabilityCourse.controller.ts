import { Body, Controller, Delete, Param, Post, Put } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from "@nestjs/swagger";
import { AppController } from "src/app/app.controller";
import { UserCapabilityCourseService } from "./userCapabilityCourse.service";

@Controller("userCapabilityCourses")
@ApiTags("userCapabilityCourses")
@ApiBearerAuth("JWT")
export class UserCapabilityCourseController extends AppController {
  constructor(private readonly userCapabilityCourseService: UserCapabilityCourseService) {
    super();
  }

  @Post()
  @ApiQuery({ name: "userId", required: false })
  @ApiQuery({ name: "courseId", required: false })
  @ApiQuery({ name: "isPreference", required: false })
  @ApiQuery({ name: "isDraft", required: false })
  @ApiBody({ type: String })
  async createUserCapabilityCourse(
    @Body()
    {
      userId,
      courseId,
      isPreference,
      isDraft,
    }: {
      userId: string;
      courseId: string;
      isPreference?: boolean;
      isDraft?: boolean;
    }
  ) {
    const response = await this.userCapabilityCourseService.createUserCapabilityCourse({ userId, courseId, isPreference, isDraft });
    return this.ok(response);
  }

  @Put("/:userCapabilityCourseId")
  async updateUserCapabilityCourse(@Param("userCapabilityCourseId") userCapabilityCourseId: string) {
    await this.userCapabilityCourseService.updateUserCapabilityCourse(userCapabilityCourseId);
    return this.ok(null);
  }

  @Delete("/:userCapabilityCourseId")
  async deleteUserCapabilityCourse(@Param("userCapabilityCourseId") userCapabilityCourseId: string) {
    await this.userCapabilityCourseService.deleteUserCapabilityCourse(userCapabilityCourseId);
    return this.ok(null);
  }
}
