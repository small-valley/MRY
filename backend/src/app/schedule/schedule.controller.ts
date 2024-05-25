import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from "@nestjs/swagger";
import { AppController } from "src/app/app.controller";
import { PostScheduleDto } from "./dto/postSchedule.dto";
import { PutScheduleCourseDto, PutScheduleInstructorOrRoomDto } from "./dto/putSchedule.dto";
import { ScheduleService } from "./schedule.service";

@Controller("schedules")
@ApiTags("schedules")
@ApiBearerAuth("JWT")
export class ScheduleController extends AppController {
  constructor(private readonly scheduleService: ScheduleService) {
    super();
  }

  @Get("ongoing-and-upcoming")
  @ApiQuery({ name: "userId", required: true })
  async getOngoingAndUpcomingSchedules(@Query("userId") userId: string) {
    const schedules = await this.scheduleService.getOngoingAndUpcomingSchedules(userId);
    return this.ok(schedules);
  }

  @Post()
  @ApiBody({ type: PostScheduleDto })
  async createSchedule(@Body() request: PostScheduleDto) {
    await this.scheduleService.createSchedule(request);
    return this.created();
  }

  @Put("instructor/room")
  @ApiBody({ type: PutScheduleInstructorOrRoomDto })
  async updateScheduleInstructorOrRoom(@Body() request: PutScheduleInstructorOrRoomDto) {
    await this.scheduleService.updateScheduleInstructorOrRoom(request);
    return this.ok(null);
  }

  @Put("course")
  @ApiBody({ type: PutScheduleCourseDto })
  async updateScheduleCourse(@Body() request: PutScheduleCourseDto) {
    await this.scheduleService.updateScheduleCourse(request);
    return this.ok(null);
  }

  @Delete(":scheduleId")
  async deleteSchedule(@Param("scheduleId") scheduleId: string) {
    await this.scheduleService.deleteSchedule(scheduleId);
    return this.ok(null);
  }
}
