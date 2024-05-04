import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_FILTER } from "@nestjs/core";
import { AllExceptionsFilter } from "src/filter/exception.filter";
import { AuthModule } from "../auth/auth.module";
import { RepositoryModule } from "../repository/repository.module";
import { AvailabilityController } from "./availability/availability.controller";
import { AvailabilityService } from "./availability/availability.service";
import { CohortController } from "./cohort/cohort.controller";
import { CohortService } from "./cohort/cohort.service";
import { CourseService } from "./course/course.service";
import { DashboardController } from "./dashboard/dashboard.controller";
import { DashboardService } from "./dashboard/dashboard.service";
import { DayController } from "./day/day.controller";
import { DayService } from "./day/day.service";
import { NotificationController } from "./notification/notification.controller";
import { NotificationService } from "./notification/notification.service";
import { ProgramController } from "./program/program.controller";
import { ProgramService } from "./program/program.service";
import { RoomService } from "./room/room.service";
import { S3Service } from "./s3/s3.service";
import { ScheduleController } from "./schedule/schedule.controller";
import { ScheduleService } from "./schedule/schedule.service";
import { SchoolBreakController } from "./schoolBreak/schoolBreak.controller";
import { SchoolBreakService } from "./schoolBreak/schoolBreak.service";
import { TimeController } from "./time/time.controller";
import { TimeService } from "./time/time.service";
import { TodoController } from "./todo/todo.controller";
import { TodoService } from "./todo/todo.service";
import { UserController } from "./user/user.controller";
import { UserService } from "./user/user.service";
import { UserCapabilityCourseController } from "./userCapabilityCourse/userCapabilityCourse.controller";
import { UserCapabilityCourseService } from "./userCapabilityCourse/userCapabilityCourse.service";
import { UserCapabilityDayController } from "./userCapabilityDay/userCapabilityDay.controller";
import { UserCapabilityDayService } from "./userCapabilityDay/userCapabilityDay.service";
import { UserCapabilityTimeController } from "./userCapabilityTime/userCapabilityTime.controller";
import { UserCapabilityTimeService } from "./userCapabilityTime/userCapabilityTime.service";
import { UserDayoffController } from "./userDayoff/userDayoff.controller";
import { UserDayoffService } from "./userDayoff/userDayoff.service";

@Module({
  imports: [
    RepositoryModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
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
    CourseService,
    DayService,
    NotificationService,
    UserDayoffService,
    UserCapabilityCourseService,
    UserCapabilityDayService,
    UserCapabilityTimeService,
    TimeService,
    SchoolBreakService,
    S3Service,
    DashboardService,
    // Set global exception filter
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
