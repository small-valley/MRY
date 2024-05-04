import { Inject, Injectable } from "@nestjs/common";
import { BadRequestError } from "src/error/badRequest.error";
import { NotFoundError } from "src/error/notFound.error";
import { BREAK } from "src/repository/consts/course.const";
import { ICohortRepository } from "src/repository/interfaces/ICohortRepository";
import { IRepositoryService } from "src/repository/interfaces/IRepositoryService";
import { RecentCohortModel } from "src/repository/models/cohort.model";
import { ScheduleRepository } from "src/typeorm/repositories/schedule.repository";
import { GetCohortsRequest } from "../../../../shared/models/requests/getCohortsRequest";
import { GetCohortResponse } from "../../../../shared/models/responses/getCohortResponse";
import { GetCohortsResponse } from "../../../../shared/models/responses/getCohortsResponse";
import { ProgramService } from "../program/program.service";
import { ScheduleService } from "../schedule/schedule.service";
import { TimeService } from "../time/time.service";
import { PostCohortDto } from "./dto/postCohort.dto";

@Injectable()
export class CohortService {
  @Inject("cohortRepository")
  private readonly cohortRepository: ICohortRepository;
  @Inject("scheduleRepository")
  private readonly scheduleRepository: ScheduleRepository;
  @Inject("repositoryService")
  private readonly repositoryService: IRepositoryService;
  @Inject(ScheduleService)
  private readonly scheduleService: ScheduleService;
  @Inject(TimeService)
  private readonly timeService: TimeService;
  @Inject(ProgramService)
  private readonly programService: ProgramService;

  async getCohorts({ startDate, endDate }: GetCohortsRequest): Promise<GetCohortsResponse[]> {
    const response = await this.cohortRepository.getCohorts({
      startDate,
      endDate,
    });
    return response;
  }

  async getCohort(cohortId: string): Promise<GetCohortResponse> {
    const model = await this.cohortRepository.getCohort(cohortId);
    if (!model) {
      throw new NotFoundError(`Cohort data specified by Cohort id: ${cohortId} was not found`);
    }
    const response: GetCohortResponse = {
      programId: model.programId,
      program: model.programName,
      cohortId: model.cohortId,
      name: model.cohortName,
      period: model.timeName,
      course: model.schedules.map((schedule) => ({
        scheduleId: schedule.scheduleId,
        startDate: schedule.startDate,
        endDate: schedule.endDate,
        courseId: schedule.courseId,
        name: schedule.courseName,
        dayId: schedule.dayId,
        days: schedule.dayName,
        instructorId: schedule.userId,
        instructor: schedule.userFirstName,
        status: this.getCourseStatus(schedule.startDate, schedule.endDate, schedule.courseName),
        roomId: schedule.roomId,
        room: schedule.roomName,
        currentHour: schedule.currentHour,
        courseHour: schedule.courseHour,
      })),
    };
    return response;
  }

  async getRecentCohort(programId: string): Promise<RecentCohortModel[]> {
    await this.programService.isExistsProgramId(programId);
    const response = await this.cohortRepository.getRecentCohorts(programId);
    return response;
  }

  async createCohort(request: PostCohortDto): Promise<string> {
    await this.validateCohort(request);
    return await this.saveCohort(request);
  }

  private getCourseStatus(
    startDate: Date,
    endDate: Date,
    courseName: string
  ): "upcoming" | "ongoing" | "finished" | "break" {
    const currentDate = new Date();
    //HACK: To distinguish break from other courses, we need to add a new field to the schedule entity
    if (courseName === BREAK) {
      return "break";
    } else if (currentDate < new Date(startDate) || !startDate) {
      return "upcoming";
    } else if (new Date(endDate) < currentDate) {
      return "finished";
    } else {
      return "ongoing";
    }
  }

  private async validateCohort(request: PostCohortDto) {
    // check id existence
    await this.timeService.getTimeById(request.periodId);

    let courses: { courseId: string; courseHour: number; currentHour: number }[] = [];
    await Promise.all(
      request.schedules.map(async (schedule) => {
        courses.push(
          await this.scheduleService.validateScheduleCohort(
            new Date(schedule.startDate),
            new Date(schedule.endDate),
            schedule.courseId,
            schedule.dayId,
            request.programId
          )
        );
      })
    );

    this.checkCurrentHour(courses);
  }

  private checkCurrentHour(courses: { courseId: string; courseHour: number; currentHour: number }[]) {
    const exceedingCourseHourCourse = courses
      .reduce((acc: { courseId: string; totalCurrentHour: number; courseHour: number }[], course) => {
        const existingCourse = acc.find((item) => item.courseId === course.courseId);
        if (existingCourse) {
          existingCourse.totalCurrentHour += course.currentHour;
        } else {
          // TODO: if the course is break, don't need to check the course hour
          // if (course.isBreak) {
          //   return acc;
          // }
          acc.push({ courseId: course.courseId, totalCurrentHour: course.currentHour, courseHour: course.courseHour });
        }
        return acc;
      }, [])
      .filter((aggregateCourse) => {
        return aggregateCourse.courseHour < aggregateCourse.totalCurrentHour;
      });

    if (exceedingCourseHourCourse.length > 0) {
      throw new BadRequestError(`Course with id: ${exceedingCourseHourCourse[0].courseId} exceeds course hour.`);
    }
  }

  private async saveCohort(request: PostCohortDto) {
    const queryRunner = await this.repositoryService.beginTransaction();
    try {
      const cohortId = await this.cohortRepository.insertCohort(
        {
          programId: request.programId,
          name: request.cohortName,
          timeId: request.periodId,
          // TODO: add properties to the request
          intake: "",
          studentCount: 0,
        },
        queryRunner
      );
      await Promise.all(
        request.schedules.map(async (schedule) => {
          await this.scheduleRepository.insertSchedule(
            {
              cohortId: cohortId,
              startDate: schedule.startDate,
              endDate: schedule.endDate,
              courseId: schedule.courseId,
              dayId: schedule.dayId,
              instructorId: null,
              roomId: null,
            },
            queryRunner
          );
        })
      );
      await this.repositoryService.commitTransaction(queryRunner);
      return cohortId;
    } catch (error) {
      await this.repositoryService.rollbackTransaction(queryRunner);
      throw error;
    } finally {
      await this.repositoryService.release(queryRunner);
    }
  }
}
