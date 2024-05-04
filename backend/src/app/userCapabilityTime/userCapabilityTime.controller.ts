import { Body, Controller, Delete, Param, Post, Put } from "@nestjs/common";
import { AppController } from "src/app.controller";
import { UserCapabilityTimeService } from "./userCapabilityTime.service";
import { ApiBody, ApiQuery, ApiTags } from "@nestjs/swagger";

@Controller("userCapabilityTimes")
@ApiTags("userCapabilityTimes")
export class UserCapabilityTimeController extends AppController {
  constructor(private readonly userCapabilityTimeService: UserCapabilityTimeService) {
    super();
  }

  @Post()
  @ApiQuery({ name: "userId", required: true })
  @ApiQuery({ name: "timeId", required: true })
  @ApiQuery({ name: "isDraft", required: false })
  @ApiBody({ type: String })
  async createUserCapabilityTime(
    @Body() { userId, timeId, isDraft }: { userId: string, timeId: string, isDraft?: boolean },
  ) {
    await this.userCapabilityTimeService.createUserCapabilityTime({ userId, timeId, isDraft });
    return this.created();
  }

  @Put("/:userCapabilityTimeId")
  async updateUserCapabilityTime(@Param("userCapabilityTimeId") userCapabilityTimeId: string) {
    await this.userCapabilityTimeService.updateUserCapabilityTime(userCapabilityTimeId);
    return this.ok(null);
  }

  @Delete("/:userCapabilityTimeId")
  async deleteUserCapabilityTime(@Param("userCapabilityTimeId") userCapabilityTimeId: string) {
    await this.userCapabilityTimeService.deleteUserCapabilityTime(userCapabilityTimeId);
    return this.ok(null);
  }
}
