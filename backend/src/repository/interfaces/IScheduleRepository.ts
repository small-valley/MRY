import { QueryRunner } from "typeorm";
import {
  GetOngoingAndUpcomingScheduleModel,
  InsertScheduleModel,
  ScheduleModel,
  UpdateScheduleModel,
} from "../models/schedule.model";

export interface IScheduleRepository {
  getOngoingAndUpcomingSchedules(userId: string): Promise<GetOngoingAndUpcomingScheduleModel[]>;
  isExistsScheduleId(scheduleId: string): Promise<boolean>;
  getScheduleById(scheduleId: string): Promise<ScheduleModel | null>;
  updateScheduleInstructorOrRoom(scheduleId: string, instructorId?: string, roomId?: string): Promise<void>;
  getOverlappingSchedules(
    startDate: string,
    endDate: string,
    scheduleId?: string,
    cohortId?: string
  ): Promise<ScheduleModel[]>;
  insertSchedule(schedule: InsertScheduleModel, queryRunner?: QueryRunner): Promise<string>;
  updateScheduleCourse(schedule: UpdateScheduleModel, queryRunner?: QueryRunner): Promise<void>;
  deleteSchedule(scheduleId: string, queryRunner?: QueryRunner): Promise<void>;
}
