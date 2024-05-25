import { Body, Controller, Delete, Param, Post, Put } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from "@nestjs/swagger";
import { AppController } from "src/app/app.controller";
import { UserCapabilityTimeService } from "./userCapabilityTime.service";

@Controller("userCapabilityTimes")
@ApiTags("userCapabilityTimes")
@ApiBearerAuth("JWT")
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
    @Body() { userId, timeId, isDraft }: { userId: string; timeId: string; isDraft?: boolean }
  ) {
    const response = await this.userCapabilityTimeService.createUserCapabilityTime({ userId, timeId, isDraft });
    return this.ok(response);
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
