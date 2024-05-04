import { Body, Controller, Delete, Param, Post, Put } from "@nestjs/common";
import { AppController } from "src/app.controller";
import { UserCapabilityCourseService } from "./userCapabilityCourse.service";
import { ApiBody, ApiQuery, ApiTags } from "@nestjs/swagger";

@Controller("userCapabilityCourses")
@ApiTags("userCapabilityCourses")
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
    @Body() { userId, courseId, isPreference, isDraft }: { userId: string, courseId: string, isPreference?: boolean, isDraft?: boolean },
  ) {
    await this.userCapabilityCourseService.createUserCapabilityCourse({ userId, courseId, isPreference, isDraft });
    return this.created();
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
