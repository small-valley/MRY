import { InjectRepository } from "@nestjs/typeorm";
import { IScheduleRepository } from "src/repository/interfaces/IScheduleRepository";
import {
  GetOngoingAndUpcomingScheduleModel,
  InsertScheduleModel,
  ScheduleModel,
  UpdateScheduleModel,
} from "src/repository/models/schedule.model";
import { QueryRunner, Repository } from "typeorm";
import { Course } from "../entities/course.entity";
import { Schedule } from "../entities/schedule.entity";
import { Todo } from "../entities/todo.entity";

export class ScheduleRepository implements IScheduleRepository {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>
  ) {}

  async getOngoingAndUpcomingSchedules(userId: string): Promise<GetOngoingAndUpcomingScheduleModel[]> {
    return await this.scheduleRepository
      .createQueryBuilder("schedule")
      .leftJoinAndMapOne("schedule.course", Course, "course", "schedule.courseId = course.id")
      .leftJoinAndMapMany("schedule.todos", Todo, "todos", "todos.scheduleId = schedule.id AND todos.isDeleted = false")
      .where("schedule.isDeleted = false")
      .andWhere("schedule.userId = :userId", { userId })
      .andWhere("schedule.endDate >= NOW()")
      .orderBy("schedule.startDate")
      .select([
        "schedule.id",
        "schedule.cohortId",
        "schedule.startDate",
        "schedule.endDate",
        "schedule.courseId",
        "course.name",
        "schedule.dayId",
        "schedule.userId",
        "schedule.roomId",
        "todos.id",
        "todos.title",
        "todos.description",
        "todos.dueDate",
        "todos.isCompleted",
      ])
      .getMany();
  }

  async isExistsScheduleId(scheduleId: string): Promise<boolean> {
    return await this.scheduleRepository.exists({
      where: { id: scheduleId, isDeleted: false },
    });
  }

  async getScheduleById(scheduleId: string): Promise<ScheduleModel | null> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id: scheduleId, isDeleted: false },
    });

    return {
      id: schedule?.id,
      cohortId: schedule?.cohortId,
      startDate: schedule?.startDate,
      endDate: schedule?.endDate,
      courseId: schedule?.courseId,
      dayId: schedule?.dayId,
      instructorId: schedule?.userId,
      roomId: schedule?.roomId,
    };
  }

  async updateScheduleInstructorOrRoom(scheduleId: string, instructorId?: string, roomId?: string) {
    await this.scheduleRepository.update(
      { id: scheduleId },
      // update only if the value is provided
      {
        ...(instructorId && { userId: instructorId }),
        ...(roomId && { roomId }),
      }
    );
  }

  async getOverlappingSchedules(
    startDate: string,
    endDate: string,
    scheduleId?: string,
    cohortId?: string
  ): Promise<ScheduleModel[]> {
    const schedules = await this.scheduleRepository
      .createQueryBuilder("schedule")
      .leftJoin("courses", "course", "schedule.course_id = course.id AND course.is_deleted = false")
      .where("1 = 1")
      .andWhere(
        scheduleId
          ? `schedule.cohort_id IN (${this.getCohortIdByScheduleId(scheduleId).getQuery()})`
          : `schedule.cohort_id = '${cohortId}'`
      )
      .andWhere("schedule.is_deleted = false")
      .andWhere(
        `((schedule.start_date <= '${startDate}' AND '${startDate}' <= schedule.end_date)
      OR (schedule.start_date <= '${endDate}' AND '${endDate}' <= schedule.end_date)
      OR ('${startDate}' <= schedule.start_date AND schedule.end_date <= '${endDate}')
      ${scheduleId ? `OR schedule.id = '${scheduleId}'` : ""})`
      )
      .select([
        "schedule.id AS id",
        "schedule.cohort_id AS cohortId",
        "schedule.start_date AS startDate",
        "schedule.end_date AS endDate",
        "schedule.course_id AS courseId",
        "course.name AS courseName",
        "schedule.day_id AS dayId",
        "schedule.user_id AS instructorId",
        "schedule.room_id AS roomId",
      ])
      .getRawMany<OverlappingScheduleModel>();

    // HACK: Uppercase in column name returns as lowercase
    return schedules.map((schedule) => ({
      id: schedule.id,
      cohortId: schedule.cohortid,
      startDate: schedule.startdate,
      endDate: schedule.enddate,
      courseId: schedule.courseid,
      courseName: schedule.coursename,
      dayId: schedule.dayid,
      instructorId: schedule.instructorid,
      roomId: schedule.roomid,
    }));
  }

  getCohortIdByScheduleId(scheduleId: string) {
    return this.scheduleRepository.createQueryBuilder("s").select("s.cohort_id").where(`s.id = '${scheduleId}'`);
  }

  async insertSchedule(schedule: InsertScheduleModel, queryRunner?: QueryRunner): Promise<string> {
    const result = await this.getRepository(queryRunner).insert({
      cohortId: schedule.cohortId,
      startDate: schedule.startDate,
      endDate: schedule.endDate,
      courseId: schedule.courseId,
      dayId: schedule.dayId,
      userId: schedule.instructorId,
      roomId: schedule.roomId,
    });
    return result.identifiers[0].id as string;
  }

  async updateScheduleCourse(schedule: UpdateScheduleModel, queryRunner?: QueryRunner) {
    await this.getRepository(queryRunner).update(
      { id: schedule.id },
      {
        startDate: schedule.startDate,
        endDate: schedule.endDate,
        courseId: schedule.courseId,
        dayId: schedule.dayId,
        userId: schedule.instructorId,
        roomId: schedule.roomId,
      }
    );
  }

  async deleteSchedule(scheduleId: string, queryRunner?: QueryRunner) {
    await this.getRepository(queryRunner).delete({ id: scheduleId });
  }

  getRepository(queryRunner?: QueryRunner) {
    return queryRunner ? queryRunner.manager.getRepository(Schedule) : this.scheduleRepository;
  }
}

/**
 * Custom return type for the method getOverlappingSchedules
 */
interface OverlappingScheduleModel {
  id: string;
  cohortid: string;
  startdate: Date;
  enddate: Date;
  courseid: string;
  coursename: string;
  dayid: string;
  instructorid: string;
  roomid: string;
}
