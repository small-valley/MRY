import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AvailabilityController } from "./app/availability/availability.controller";
import { AvailabilityService } from "./app/availability/availability.service";
import { CohortController } from "./app/cohort/cohort.controller";
import { CohortService } from "./app/cohort/cohort.service";
import { CourseService } from "./app/course/course.service";
import { DashboardController } from "./app/dashboard/dashboard.controller";
import { DashboardService } from "./app/dashboard/dashboard.service";
import { DayController } from "./app/day/day.controller";
import { DayService } from "./app/day/day.service";
import { NotificationController } from "./app/notification/notification.controller";
import { NotificationService } from "./app/notification/notification.service";
import { ProgramController } from "./app/program/program.controller";
import { ProgramService } from "./app/program/program.service";
import { RoomService } from "./app/room/room.service";
import { S3Service } from "./app/s3/s3.service";
import { ScheduleController } from "./app/schedule/schedule.controller";
import { ScheduleService } from "./app/schedule/schedule.service";
import { SchoolBreakController } from "./app/schoolBreak/schoolBreak.controller";
import { SchoolBreakService } from "./app/schoolBreak/schoolBreak.service";
import { TimeController } from "./app/time/time.controller";
import { TimeService } from "./app/time/time.service";
import { TodoController } from "./app/todo/todo.controller";
import { TodoService } from "./app/todo/todo.service";
import { UserController } from "./app/user/user.controller";
import { UserService } from "./app/user/user.service";
import { UserCapabilityCourseController } from "./app/userCapabilityCourse/userCapabilityCourse.controller";
import { UserCapabilityCourseService } from "./app/userCapabilityCourse/userCapabilityCourse.service";
import { UserCapabilityDayController } from "./app/userCapabilityDay/userCapabilityDay.controller";
import { UserCapabilityDayService } from "./app/userCapabilityDay/userCapabilityDay.service";
import { UserCapabilityTimeController } from "./app/userCapabilityTime/userCapabilityTime.controller";
import { UserCapabilityTimeService } from "./app/userCapabilityTime/userCapabilityTime.service";
import { UserDayoffController } from "./app/userDayoff/userDayoff.controller";
import { UserDayoffService } from "./app/userDayoff/userDayoff.service";
import { RepositoryModule } from "./repository/repository.module";

@Module({
  imports: [
    RepositoryModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [
    CohortController,
    UserController,
    AvailabilityController,
    ProgramController,
    TodoController,
    ScheduleController,
    NotificationController,
    UserDayoffController,
    UserCapabilityCourseController,
    UserCapabilityDayController,
    UserCapabilityTimeController,
    DayController,
    TimeController,
    SchoolBreakController,
    DashboardController,
  ],
  providers: [
    CohortService,
    UserService,
    AvailabilityService,
    TodoService,
    ProgramService,
    ScheduleService,
    RoomService,
    NotificationService,
    UserDayoffService,
    UserCapabilityCourseService,
    UserCapabilityDayService,
    UserCapabilityTimeService,
    CourseService,
    DayService,
    TimeService,
    SchoolBreakService,
    S3Service,
    DashboardService,
  ],
})
export class AppModule {}
