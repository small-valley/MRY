import { Module } from "@nestjs/common";
import { AvailabilityRepository } from "src/typeorm/repositories/availability.repository";
import { CohortRepository } from "src/typeorm/repositories/cohort.repository";
import { CourseRepository } from "src/typeorm/repositories/course.repository";
import { DashboardRepository } from "src/typeorm/repositories/dashboard.repository";
import { DayRepository } from "src/typeorm/repositories/day.repository";
import { NotificationRepository } from "src/typeorm/repositories/notification.repository";
import { ProgramRepository } from "src/typeorm/repositories/program.repository";
import { RoomRepository } from "src/typeorm/repositories/room.repository";
import { ScheduleRepository } from "src/typeorm/repositories/schedule.repository";
import { SchoolBreakRepository } from "src/typeorm/repositories/schoolBreak.repository";
import { TimeRepository } from "src/typeorm/repositories/time.repository";
import { TodoRepository } from "src/typeorm/repositories/todo.repository";
import { UserRepository } from "src/typeorm/repositories/user.repository";
import { UserCapabilityCourseRepository } from "src/typeorm/repositories/userCapabilityCourse.repository";
import { UserCapabilityDayRepository } from "src/typeorm/repositories/userCapabilityDay.repository";
import { UserCapabilityTimeRepository } from "src/typeorm/repositories/userCapabilityTime.repository";
import { UserDayoffRepository } from "src/typeorm/repositories/userDayoff.repository";
import { RepositoryService } from "../typeorm/services/repository.service";
import { TypeormModule } from "../typeorm/typeorm.module";

@Module({
  imports: [TypeormModule],
  providers: [
    {
      provide: "cohortRepository",
      useClass: CohortRepository,
      // TODO: enable to switch database
      // process.env.NODE_ENV === "development"
      //   ? UserRepository
      //   : UserRepository,
    },
    {
      provide: "availabilityRepository",
      useClass: AvailabilityRepository,
    },
    {
      provide: "userRepository",
      useClass: UserRepository,
    },
    {
      provide: "todoRepository",
      useClass: TodoRepository,
    },
    {
      provide: "programRepository",
      useClass: ProgramRepository,
    },
    {
      provide: "scheduleRepository",
      useClass: ScheduleRepository,
    },
    {
      provide: "roomRepository",
      useClass: RoomRepository,
    },
    {
      provide: "notificationRepository",
      useClass: NotificationRepository,
    },
    {
      provide: "userCapabilityCourseRepository",
      useClass: UserCapabilityCourseRepository,
    },
    {
      provide: "userCapabilityDayRepository",
      useClass: UserCapabilityDayRepository,
    },
    {
      provide: "userCapabilityTimeRepository",
      useClass: UserCapabilityTimeRepository,
    },
    {
      provide: "userDayoffRepository",
      useClass: UserDayoffRepository,
    },
    {
      provide: "courseRepository",
      useClass: CourseRepository,
    },
    {
      provide: "dayRepository",
      useClass: DayRepository,
    },
    {
      provide: "repositoryService",
      useClass: RepositoryService,
    },
    {
      provide: "timeRepository",
      useClass: TimeRepository,
    },
    {
      provide: "schoolBreakRepository",
      useClass: SchoolBreakRepository,
    },
    {
      provide: "dashboardRepository",
      useClass: DashboardRepository,
    },
  ],
  exports: [
    "cohortRepository",
    "userRepository",
    "availabilityRepository",
    "todoRepository",
    "programRepository",
    "scheduleRepository",
    "roomRepository",
    "notificationRepository",
    "userDayoffRepository",
    "userCapabilityCourseRepository",
    "userCapabilityDayRepository",
    "userCapabilityTimeRepository",
    "courseRepository",
    "dayRepository",
    "repositoryService",
    "timeRepository",
    "schoolBreakRepository",
    "dashboardRepository",
  ],
})
export class RepositoryModule {}
