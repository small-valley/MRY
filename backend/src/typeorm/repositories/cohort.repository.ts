import { InjectRepository } from "@nestjs/typeorm";
import { ICohortRepository } from "src/repository/interfaces/ICohortRepository";
import {
  CohortModel,
  CurrrentCourseHour,
  InsertCohortModel,
  RecentCohortModel,
} from "src/repository/models/cohort.model";
import { QueryRunner, Repository } from "typeorm";
import { GetCohortsForFilterResponse } from "../../../../shared/models/responses/getCohortsForFilterResponse";
import { GetCohortsResponse } from "../../../../shared/models/responses/getCohortsResponse";
import { Cohort } from "../entities/cohort.entity";
import { Schedule } from "../entities/schedule.entity";

export class CohortRepository implements ICohortRepository {
  constructor(
    @InjectRepository(Cohort)
    private cohortRepository: Repository<Cohort>,
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>
  ) {}

  async isExistsCohortId(cohortId: string): Promise<boolean> {
    return await this.cohortRepository.exists({
      where: { id: cohortId, isDeleted: false },
    });
  }

  async getCohorts({ startDate, endDate }): Promise<GetCohortsResponse[]> {
    const query = this.cohortRepository
      .createQueryBuilder("cohort")
      .innerJoin("cohort.program", "program")
      .innerJoin("cohort.time", "time")
      .innerJoin("cohort.schedules", "schedule")
      .leftJoin("schedule.course", "course")
      .leftJoin("schedule.user", "user")
      .leftJoin("schedule.day", "day")
      .leftJoin("schedule.room", "room")
      .where("cohort.is_deleted = false")
      .select([
        "program.name",
        "cohort.id",
        "cohort.name",
        "time.name",
        "schedule.id",
        "schedule.startDate",
        "schedule.endDate",
        "course.name",
        "course.color",
        "day.id",
        "day.name",
        "user.id",
        "user.firstName",
        "user.avatarUrl",
        "room.name",
      ])
      .orderBy("schedule.startDate", "ASC")
      .addOrderBy("cohort.name", "ASC");

    if (startDate) {
      query.andWhere("schedule.startDate >= :startDate", { startDate });
    }

    if (endDate) {
      query.andWhere("schedule.endDate <= :endDate", { endDate });
    }

    const cohorts = await query.getMany();

    return this.convertToGetCohortsResponse(cohorts);
  }

  async getCohortsForFilter({ startDate, endDate }): Promise<GetCohortsForFilterResponse[]> {
    const query = this.cohortRepository
      .createQueryBuilder("cohort")
      .innerJoin("cohort.program", "program")
      .innerJoin("cohort.schedules", "schedule")
      .select(["program.id", "program.name", "cohort.id", "cohort.name"])
      .orderBy("schedule.startDate", "ASC")
      .addOrderBy("cohort.name", "ASC");

    if (startDate) {
      query.andWhere("schedule.startDate >= :startDate", { startDate });
    }

    if (endDate) {
      query.andWhere("schedule.endDate <= :endDate", { endDate });
    }

    const cohorts = await query.getMany();

    return this.convertToGetCohortsForFilterResponse(cohorts);
  }

  async getCohort(cohortId: string) {
    const cohort: CohortResult[] = await this.cohortRepository
      .createQueryBuilder("cohort")
      .innerJoin("programs", "program", "cohort.program_id = program.id AND program.is_deleted = false")
      .innerJoin("times", "time", "cohort.time_id = time.id AND time.is_deleted = false")
      .innerJoin("schedules", "schedule", "cohort.id = schedule.cohort_id AND schedule.is_deleted = false")
      .leftJoin("days", "day", "schedule.day_id = day.id AND day.is_deleted = false")
      .leftJoin("schedule.user", "user")
      .leftJoin("schedule.room", "room")
      .leftJoin("schedule.course", "course")
      .leftJoin(`(${this.getCourseHourQuery(cohortId).getQuery()})`, "hour", "hour.course_id = course.id")
      .where("cohort.id = :id", { id: cohortId })
      .andWhere("cohort.is_deleted = false")
      .select([
        "program.id",
        "program.name",
        "cohort.id",
        "cohort.name",
        "time.name",
        "schedule.id",
        "schedule.startDate",
        "schedule.endDate",
        "course.id",
        "course.name",
        "day.id",
        "day.name",
        "day.hours_per_week",
        "user.id",
        "user.firstName",
        "room.id",
        "room.name",
        "hour.current_hour",
        "hour.course_hour",
      ])
      .orderBy("schedule.startDate", "ASC")
      .addOrderBy("day.name", "ASC")
      .getRawMany();

    return cohort.length === 0 ? null : this.convertToCohortModel(cohort);
  }

  async getRecentCohorts(programId: string): Promise<RecentCohortModel[]> {
    const currentDate = new Date();
    const cohorts = await this.cohortRepository
      .createQueryBuilder("cohort")
      .innerJoin(
        `(${this.getCohortIdWithEarliestStartDateSchduleQuery().getQuery()})`,
        `min`,
        `cohort.id = min.cohort_id`
      )
      .where(`cohort.id NOT IN(${this.getCohortIdsWithNullScheduleQuery(programId).getQuery()})`)
      .andWhere(`cohort.program_id = '${programId}'`)
      .andWhere(
        `min.min_start_date > '${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}'`
      )
      .orderBy("cohort.createdAt", "DESC")
      .take(5)
      .select(["cohort.id", "cohort.name", "cohort.createdAt"])
      .getMany();

    return cohorts.map((cohort) => {
      return {
        cohortId: cohort.id,
        cohortName: cohort.name,
      };
    });
  }

  async getCurrentCourseHour(
    cohortId: string,
    courseId: string,
    scheduleId: string
  ): Promise<CurrrentCourseHour | undefined> {
    const result = (await this.getCourseHourQuery(
      cohortId,
      courseId,
      scheduleId
    ).getRawOne()) as CurrentCourseHourResult;
    if (!result?.course_id) {
      return undefined;
    }
    return {
      courseId: result?.course_id,
      currentHour: result?.current_hour,
      courseHour: result?.course_hour,
    } as CurrrentCourseHour;
  }

  async insertCohort(cohort: InsertCohortModel, queryRunner?: QueryRunner): Promise<string> {
    const repository = queryRunner ? queryRunner.manager.getRepository(Cohort) : this.cohortRepository;
    const newCohort = await repository.save(cohort);
    return newCohort.id;
  }

  private getCourseHourQuery(cohortId: string, courseId?: string, scheduleId?: string) {
    return this.cohortRepository
      .createQueryBuilder("c")
      .innerJoin("schedules", "s", "c.id = s.cohort_id AND s.is_deleted = false")
      .innerJoin("courses", "co", "s.course_id = co.id AND co.is_deleted = false")
      .innerJoin("days", "d", "s.day_id = d.id AND d.is_deleted = false")
      .where("c.id = :id", { id: cohortId })
      .andWhere(courseId ? "s.course_id = :courseId" : "1=1", { courseId })
      .andWhere(scheduleId ? "s.id <> :scheduleId" : "1=1", { scheduleId })
      .groupBy("co.id")
      .select([
        "co.id AS course_id",
        "SUM(d.hours_per_week * (1 + (s.end_date - s.start_date) / 7)) AS current_hour",
        "MAX(co.hour) AS course_hour",
      ]);
  }

  // HACK: if it's possible to convert directly from query to the model, this method is not needed
  private convertToCohortModel(cohorts: CohortResult[]): CohortModel {
    return {
      programId: cohorts[0].program_id,
      programName: cohorts[0].program_name,
      cohortId: cohorts[0].cohort_id,
      cohortName: cohorts[0].cohort_name,
      timeName: cohorts[0].time_name,
      schedules: cohorts.map((schedule) => {
        return {
          scheduleId: schedule.schedule_id,
          startDate: schedule.schedule_start_date,
          endDate: schedule.schedule_end_date,
          courseId: schedule.course_id,
          courseName: schedule.course_name,
          dayId: schedule.day_id,
          dayName: schedule.day_name,
          dayHoursPerWeek: schedule.hours_per_week,
          userId: schedule.user_id,
          userFirstName: schedule.user_first_name,
          roomId: schedule.room_id,
          roomName: schedule.room_name,
          currentHour: +schedule.current_hour,
          courseHour: schedule.course_hour,
        };
      }),
    };
  }

  private convertToGetCohortsResponse(cohorts: Cohort[]): GetCohortsResponse[] {
    return cohorts.map((cohort) => {
      return {
        id: cohort.id,
        program: cohort.program.name,
        name: cohort.name,
        // TODO: cohorts table doesn't have a room_id column
        room: cohort.schedules[0].room?.name,
        period: cohort.time.name,
        schedules: cohort.schedules.map((schedule) => {
          return {
            id: schedule.id,
            startDate: schedule.startDate?.toString(),
            endDate: schedule.endDate?.toString(),
            course: {
              name: schedule.course?.name,
              color: schedule.course?.color,
            },
            // TODO: days becomes a plain string
            days: [schedule.day?.name],
            instructor: {
              id: schedule.user?.id,
              name: schedule.user?.firstName,
              avatarUrl: schedule.user?.avatarUrl,
            },
            cohortId: cohort.id,
          };
        }),
      };
    });
  }

  private convertToGetCohortsForFilterResponse(cohorts): GetCohortsForFilterResponse[] {
    const result: GetCohortsForFilterResponse[] = [];

    cohorts.forEach((cohort) => {
      const existingProgram = result.find((item) => item.programId === cohort.program.id);
      if (existingProgram) {
        existingProgram.cohorts.push({
          cohortId: cohort.id,
          cohortName: cohort.name,
        });
      } else {
        result.push({
          programId: cohort.program.id,
          programName: cohort.program.name,
          cohorts: [
            {
              cohortId: cohort.id,
              cohortName: cohort.name,
            },
          ],
        });
      }
    });

    return result;
  }

  private getCohortIdsWithNullScheduleQuery(programId: string) {
    return this.cohortRepository
      .createQueryBuilder("c")
      .innerJoin("schedules", "s", "c.id = s.cohort_id AND s.is_deleted = false")
      .where("s.course_id IS NULL")
      .andWhere("c.is_deleted = false")
      .andWhere(`c.program_id = '${programId}'`)
      .select("c.id");
  }

  private getCohortIdWithEarliestStartDateSchduleQuery() {
    return this.scheduleRepository
      .createQueryBuilder("s")
      .where("s.is_deleted = false")
      .groupBy("s.cohort_id")
      .select("s.cohort_id, MIN(s.start_date) AS min_start_date");
  }
}

/*
 * Custom return type for getCohort query
 */
interface CohortResult {
  program_id: string;
  program_name: string;
  cohort_id: string;
  cohort_name: string;
  time_name: string;
  schedule_id: string;
  schedule_start_date: Date;
  schedule_end_date: Date;
  course_id: string;
  course_name: string;
  day_id: string;
  day_name: string;
  hours_per_week: number;
  user_id: string;
  user_first_name: string;
  room_id: string;
  room_name: string;
  current_hour: number;
  course_hour: number;
}

/*
 * Custom return type for getCourseHourQuery
 */
interface CurrentCourseHourResult {
  course_id: string;
  current_hour: number;
  course_hour: number;
}
