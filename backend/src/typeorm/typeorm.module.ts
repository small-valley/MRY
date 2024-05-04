import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Cohort } from "./entities/cohort.entity";
import { ContractType } from "./entities/contract_type.entity";
import { Course } from "./entities/course.entity";
import { Day } from "./entities/day.entity";
import { Notification } from "./entities/notification.entity";
import { OverlappableDay } from "./entities/overlappable_day.entity";
import { PresetTodo } from "./entities/preset_todo.entity";
import { Program } from "./entities/program.entity";
import { ProgramUser } from "./entities/program_user.entity";
import { Room } from "./entities/room.entity";
import { Schedule } from "./entities/schedule.entity";
import { Time } from "./entities/time.entity";
import { Todo } from "./entities/todo.entity";
import { User } from "./entities/user.entity";
import { UserCapabilityCourse } from "./entities/user_capability_course.entity";
import { UserCapabilityDay } from "./entities/user_capability_day.entity";
import { UserCapabilityTime } from "./entities/user_capability_time.entity";
import { UserDayoff } from "./entities/user_dayoff.entity";
import { SchoolBreak } from "./entities/school_break.entity";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get<string>("POSTGRE_DATABASE_HOST"),
        port: configService.get<number>("POSTGRE_DATABASE_PORT"),
        username: configService.get<string>("POSTGRE_DATABASE_USER_NAME"),
        password: configService.get<string>("POSTGRE_DATABASE_PASSWORD"),
        database: configService.get<string>("POSTGRE_DATABASE_NAME"),
        entities: [
          Cohort,
          Course,
          Day,
          Notification,
          PresetTodo,
          Program,
          ProgramUser,
          Room,
          Schedule,
          Time,
          Todo,
          UserCapabilityCourse,
          UserCapabilityDay,
          UserCapabilityTime,
          UserDayoff,
          User,
          ContractType,
          OverlappableDay,
          SchoolBreak,
        ],
        synchronize: false,
        dateStrings: false, // HACK: This option is not working?
        logging: false,
      }),
    }),
    TypeOrmModule.forFeature([
      Cohort,
      Course,
      Day,
      Notification,
      PresetTodo,
      Program,
      ProgramUser,
      Room,
      Schedule,
      Time,
      Todo,
      UserCapabilityCourse,
      UserCapabilityDay,
      UserCapabilityTime,
      UserDayoff,
      User,
      ContractType,
      OverlappableDay,
      SchoolBreak,
    ]),
  ],
  providers: [],
  exports: [TypeOrmModule],
})
export class TypeormModule {}
