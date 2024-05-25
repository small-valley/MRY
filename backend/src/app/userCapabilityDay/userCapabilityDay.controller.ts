import { Body, Controller, Delete, Param, Post, Put } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from "@nestjs/swagger";
import { AppController } from "src/app/app.controller";
import { UserCapabilityDayService } from "./userCapabilityDay.service";

@Controller("userCapabilityDays")
@ApiTags("userCapabilityDays")
@ApiBearerAuth("JWT")
export class UserCapabilityDayController extends AppController {
  constructor(private readonly userCapabilityDayService: UserCapabilityDayService) {
    super();
  }

  @Post()
  @ApiQuery({ name: "userId", required: true })
  @ApiQuery({ name: "dayId", required: true })
  @ApiQuery({ name: "isDraft", required: false })
  @ApiBody({ type: String })
  async createUserCapabilityDay(
    @Body() { userId, dayId, isDraft }: { userId: string; dayId: string; isDraft?: boolean }
  ) {
    const response = await this.userCapabilityDayService.createUserCapabilityDay({ userId, dayId, isDraft });
    return this.ok(response);
  }

  @Put("/:userCapabilityDayId")
  async updateUserCapabilityDay(@Param("userCapabilityDayId") userCapabilityDayId: string) {
    await this.userCapabilityDayService.updateUserCapabilityDay(userCapabilityDayId);
    return this.ok(null);
  }

  @Delete("/:userCapabilityDayId")
  async deleteUserCapabilityDay(@Param("userCapabilityDayId") userCapabilityDayId: string) {
    await this.userCapabilityDayService.deleteUserCapabilityDay(userCapabilityDayId);
    return this.ok(null);
  }
}
