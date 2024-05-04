import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { AppController } from "src/app.controller";
import { UserDayoffService } from "./userDayoff.service";
import { ApiBody, ApiQuery, ApiTags } from "@nestjs/swagger";

@Controller("userDayoffs")
@ApiTags("userDayoffs")
export class UserDayoffController extends AppController {
  constructor(private readonly userDayoffService: UserDayoffService) {
    super();
  }

  @Get("/:userId")
  async getUserDayoff(
    @Param("userId") userId: string,
  ) {
    const result = await this.userDayoffService.getUserDayoff(userId);
    return this.ok(result);
  }

  @Post()
  @ApiQuery({ name: "userId", required: true })
  @ApiQuery({ name: "startDate", required: true })
  @ApiQuery({ name: "endDate", required: true })
  @ApiQuery({ name: "isDraft", required: false })
  @ApiBody({ type: String })
  async createUserDayoff(
    @Body() { userId, startDate, endDate, isDraft }: { userId: string, startDate: Date, endDate: Date, isDraft?: boolean },
  ) {
    const result = await this.userDayoffService.createUserDayoff({ userId, startDate, endDate, isDraft });
    return this.ok(result);
  }

  @Put("/:userDayoffId")
  async updateUserDayoff(@Param("userDayoffId") userDayoffId: string) {
    await this.userDayoffService.updateUserDayoff(userDayoffId);
    return this.ok(null);
  }

  @Delete("/:userDayoffId")
  async deleteUserDayoff(@Param("userDayoffId") userDayoffId: string) {
    await this.userDayoffService.deleteUserDayoff(userDayoffId);
    return this.ok(null);
  }
}
