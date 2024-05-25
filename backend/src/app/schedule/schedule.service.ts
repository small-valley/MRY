import { Inject, Injectable } from "@nestjs/common";
import { MONDAY } from "src/const/date.const";
import { BadRequestError } from "src/error/badRequest.error";
import { NotFoundError } from "src/error/notFound.error";
import { BREAK } from "src/repository/consts/course.const";
import { IRepositoryService } from "src/repository/interfaces/IRepositoryService";
import { IScheduleRepository } from "src/repository/interfaces/IScheduleRepository";
import { CourseModel } from "src/repository/models/course.model";
import { DayModel } from "src/repository/models/day.model";
import { ScheduleModel } from "src/repository/models/schedule.model";
import { CohortRepository } from "src/typeorm/repositories/cohort.repository";
import { TodoRepository } from "src/typeorm/repositories/todo.repository";
import { CourseService } from "../course/course.service";
import { DayService } from "../day/day.service";
import { ProgramService } from "../program/program.service";
import { RoomService } from "../room/room.service";
import { UserService } from "../user/user.service";
import { PostScheduleDto } from "./dto/postSchedule.dto";
import { PutScheduleCourseDto, PutScheduleInstructorOrRoomDto } from "./dto/putSchedule.dto";

@Injectable()
export class ScheduleService {
  @Inject("scheduleRepository")
  private readonly scheduleRepository: IScheduleRepository;
  @Inject("cohortRepository")
  private readonly cohortRepository: CohortRepository;
  @Inject("todoRepository")
  private readonly todoRepository: TodoRepository;
  @Inject(UserService)
  private readonly userService: UserService;
  @Inject(RoomService)
  private readonly roomService: RoomService;
  @Inject(CourseService)
  private readonly courseService: CourseService;
  @Inject(DayService)
  private readonly dayService: DayService;
  @Inject(ProgramService)
  private readonly programService: ProgramService;
  @Inject("repositoryService")
  private readonly repositoryService: IRepositoryService;

  async getOngoingAndUpcomingSchedules(userId: string) {
    return await this.scheduleRepository.getOngoingAndUpcomingSchedules(userId);
  }

  async isExistsScheduleId(scheduleId: string): Promise<void | never> {
    const isExistsScheduleId = await this.scheduleRepository.isExistsScheduleId(scheduleId);
    if (!isExistsScheduleId) {
      throw new NotFoundError(`Schedule id: ${scheduleId} does not exist`);
    }
  }

  async createSchedule(request: PostScheduleDto) {
    // check id existence
    await this.isExistsCohortId(request.cohortId);
    // other validations
    const [schedules, _] = await this.validateScheduleCourse(
      new Date(request.startDate),
      new Date(request.endDate),
      request.courseId,
      request.dayId,
      null, //scheduleId
      request.cohortId
    );

    await this.saveCreateScheduleCourse(request, schedules);
  }

  async updateScheduleInstructorOrRoom(request: PutScheduleInstructorOrRoomDto) {
    // If both instructorId and roomId are not provided, then do nothing
    if (!request.instructorId && !request.roomId) {
      return;
    }

    // check id existence
    await this.isExistsScheduleId(request.scheduleId);
    if (request.instructorId) {
      await this.userService.isExistsUserId(request.instructorId);
    }
    if (request.roomId) {
      await this.roomService.isExistsRoomId(request.roomId);
    }

    // update schedule
    await this.scheduleRepository.updateScheduleInstructorOrRoom(
      request.scheduleId,
      request.instructorId,
      request.roomId
    );
  }

  async updateScheduleCourse(request: PutScheduleCourseDto) {
    const [schedules, updateSchedule] = await this.validateScheduleCourse(
      new Date(request.startDate),
      new Date(request.endDate),
      request.courseId,
      request.dayId,
      request.scheduleId,
      null //cohortId
    );
    await this.saveUpdateScheduleCourse(request, updateSchedule, schedules);
  }

  async deleteSchedule(scheduleId: string) {
    // check id existence
    const schedule = await this.scheduleRepository.getScheduleById(scheduleId);
    if (!schedule) {
      throw new NotFoundError(`Schedule id: ${scheduleId} does not exist`);
    }
    // check the schedule is upcoming
    if (new Date(schedule.startDate) <= new Date()) {
      throw new BadRequestError(`Only upcoming schedule can be deleted.`);
    }

    // update schedule except Date
    // await this.scheduleRepository.updateScheduleCourse({
    //   id: scheduleId,
    //   startDate: schedule.startDate as unknown as string,
    //   endDate: schedule.endDate as unknown as string,
    //   courseId: null,
    //   dayId: null,
    //   instructorId: null,
    //   roomId: null,
    // });

    const queryRunner = await this.repositoryService.beginTransaction();
    try {
      await this.todoRepository.deleteTodo(scheduleId, queryRunner);
      await this.scheduleRepository.deleteSchedule(scheduleId, queryRunner);
      await this.repositoryService.commitTransaction(queryRunner);
    } catch (error) {
      await this.repositoryService.rollbackTransaction(queryRunner);
      throw new Error(error);
    } finally {
      await this.repositoryService.release(queryRunner);
    }
  }

  async validateScheduleCohort(
    startDate: Date,
    endDate: Date,
    courseId: string,
    dayId: string,
    programId: string
  ): Promise<{ courseId: string; courseHour: number; currentHour: number }> {
    this.checkDateOrder(startDate, endDate);
    //this.checkDate(startDate, MONDAY);
    //this.checkDate(endDate, FRIDAY);
    this.checkStartDate(startDate);

    // check id existence
    let course: CourseModel;
    if (courseId) {
      course = await this.courseService.getCourse(courseId);
    }
    // check id existence
    let day: DayModel;
    if (dayId) {
      day = await this.dayService.getDay(dayId);
    }

    // check course is belonging to the same program
    if (courseId) {
      await this.programService.isBelongsToTheSameProgramByProgramId(programId, courseId);
    }
    // calculate current hour
    const weeks = this.calculateWeeks(startDate, endDate);

    // validate current hour with course hour in higher level function
    return {
      courseId: courseId,
      courseHour: course.hour,
      currentHour: weeks * day?.hoursPerWeek,
    };
  }

  private async validateScheduleCourse(
    startDate: Date,
    endDate: Date,
    courseId?: string,
    dayId?: string,
    scheduleId?: string,
    cohortId?: string
  ): Promise<[ScheduleModel[], ScheduleModel]> {
    const isUpdate = !!scheduleId;

    this.checkDateOrder(startDate, endDate);
    //this.checkDate(startDate, MONDAY);
    //this.checkDate(endDate, FRIDAY);
    if (!isUpdate) {
      this.checkStartDate(startDate);
    }

    // get schedule data and overlapping schedules in terms of startDate and endDate, including break time
    const schedules = await this.scheduleRepository.getOverlappingSchedules(
      this.getUtcDateString(startDate),
      this.getUtcDateString(endDate),
      scheduleId,
      cohortId
    );
    const updateSchedule = schedules.find((schedule) => schedule.id === scheduleId);

    if (isUpdate) {
      this.checkScheduleId(updateSchedule, scheduleId);
      this.checkEndDate(endDate);
      this.checkOriginalEndDate(updateSchedule.endDate);
      // check start date only when original schedule is upcoming
      if (updateSchedule.startDate > new Date()) {
        this.checkStartDate(startDate);
      }
    }
    //this.checkOverlappingWithBreak(schedules, startDate, endDate);

    // check id existence
    let course: CourseModel;
    if (courseId) {
      course = await this.courseService.getCourse(courseId);
    }
    // check id existence
    let day: DayModel;
    if (dayId) {
      day = await this.dayService.getDay(dayId);
    }

    cohortId = isUpdate ? updateSchedule.cohortId : cohortId;

    if (courseId) {
      // check course and cohort are belonging to the same program
      await this.programService.isBelongsToTheSameProgramByCohortId(cohortId, courseId);
      // await this.checkCurrentCourseHour(
      //   startDate,
      //   endDate,
      //   courseId,
      //   dayId,
      //   cohortId,
      //   course.hour,
      //   day.hoursPerWeek,
      //   scheduleId
      // );
    }

    // TODO: considering about schedule which including break time -> create separated schedule records which includes break
    // might allow overlapping schedules which are Mon - Wed and Wed-Fri
    // check endDate is not greater than estimated cohort end date

    return [schedules, updateSchedule];
  }

  private checkDateOrder(startDate: Date, endDate: Date) {
    // check startDate < endDate
    if (startDate > endDate) {
      throw new BadRequestError("startDate should be smaller than endDate.");
    }
  }

  private getTimeZoneOffset(): number {
    // Get the time zone offset in minutes
    const timeZoneOffsetMinutes = new Date().getTimezoneOffset();
    // Determine if the offset is ahead or behind UTC
    return timeZoneOffsetMinutes > 0 ? -1 : 0;
  }

  private checkDate(date: Date, numberOfDate: number) {
    // check start date is Monday
    // check end date is Friday
    const dateString = numberOfDate === MONDAY ? "startDate" : "endDate";
    const dayString = numberOfDate === MONDAY ? "Monday" : "Friday";
    // getDay returns result according to local time zone
    // if (!(date.getDay() === numberOfDate + this.getTimeZoneOffset())) {
    if (!(date.getUTCDay() === numberOfDate)) {
      throw new BadRequestError(`${dateString} should be ${dayString}.`);
    }
  }

  private checkStartDate(startDate: Date) {
    // check startDate is not smaller than current date
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    if (startDate <= currentDate) {
      throw new BadRequestError("startDate should be greater than current date.");
    }
  }

  private checkEndDate(endDate: Date) {
    // check endDate is not smaller than current date
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    if (endDate <= currentDate) {
      throw new BadRequestError("endDate should be greater than current date.");
    }
  }

  private checkScheduleId(schedule: ScheduleModel | null, scheduleId: string) {
    // check id existence
    if (!schedule) {
      throw new NotFoundError(`Schedule id: ${scheduleId} does not exist`);
    }
  }

  private checkOriginalEndDate(endDate: Date | null) {
    // check the schedule is not ended
    if (endDate && new Date(endDate) <= new Date()) {
      throw new BadRequestError(`Ended schedule cannot be updated.`);
    }
  }

  private checkOverlappingWithBreak(schedules: ScheduleModel[], startDate: Date, endDate: Date) {
    // check whether start or end date is overlapped with break
    if (
      schedules.some(
        (schedule) =>
          schedule.courseName === BREAK &&
          ((schedule.startDate <= startDate && startDate <= schedule.endDate) ||
            (schedule.startDate <= endDate && endDate <= schedule.endDate) ||
            (schedule.startDate <= startDate && endDate <= schedule.endDate))
      )
    ) {
      throw new BadRequestError(`start or end date must not overlapped with break.`);
    }
  }

  private calculateWeeks(startDate: Date, endDate: Date): number {
    // Mon - Fri -> 5 days + 2 days -> 1 week
    return Math.ceil((endDate.getTime() - startDate.getTime() + 1000 * 60 * 60 * 24 * 2) / (1000 * 60 * 60 * 24 * 7));
  }

  private isExceedsCourseHour(coursehour: number, currentHour: number, weeks: number, hoursPerWeek: number): boolean {
    return coursehour < currentHour + weeks * hoursPerWeek;
  }

  private async checkCurrentCourseHour(
    startDate: Date,
    endDate: Date,
    courseId: string,
    dayId: string,
    cohortId: string,
    courseHour: number,
    hoursPerWeek: number,
    scheduleId?: string
  ) {
    // check whether current hour does not exceed course hour
    if (courseId && dayId && startDate && endDate) {
      let currentCourseHour = await this.getCurrentCourseHour(cohortId, courseId, scheduleId);
      // when no other schedules with the same course is found, set course hour from course table
      if (!currentCourseHour) {
        currentCourseHour = {
          courseId: courseId,
          courseHour: courseHour,
          currentHour: 0,
        };
      }
      if (
        this.isExceedsCourseHour(
          currentCourseHour.courseHour,
          currentCourseHour.currentHour,
          this.calculateWeeks(startDate, endDate),
          hoursPerWeek
        )
      ) {
        throw new BadRequestError(`Current hour exceeds course hour.`);
      }
    }
  }

  private async saveCreateScheduleCourse(request: PostScheduleDto, schedules: ScheduleModel[]) {
    const queryRunner = await this.repositoryService.beginTransaction();
    try {
      // insert new schedule
      const newScheduleId = await this.scheduleRepository.insertSchedule(
        {
          cohortId: request.cohortId,
          startDate: request.startDate,
          endDate: request.endDate,
          courseId: request.courseId,
          dayId: request.dayId,
          instructorId: null,
          roomId: null,
        },
        queryRunner
      );
      await this.todoRepository.createTodosFromTemplate([newScheduleId], queryRunner);
      // update overlapped schedules (create blank schedules)
      // await Promise.all(
      //   schedules.map(async (schedule) => {
      //     await this.scheduleRepository.updateScheduleCourse(
      //       {
      //         id: schedule.id,
      //         // if schedule is break, not update dates
      //         startDate: schedule.courseName === BREAK ? this.getUtcDateString(schedule.startDate) : null,
      //         endDate: schedule.courseName === BREAK ? this.getUtcDateString(schedule.endDate) : null,
      //         courseId: schedule.courseId,
      //         dayId: schedule.dayId,
      //         instructorId: null,
      //         roomId: null,
      //       },
      //       queryRunner
      //     );
      //   })
      // );
      await this.repositoryService.commitTransaction(queryRunner);
    } catch (error) {
      await this.repositoryService.rollbackTransaction(queryRunner);
      throw new Error(error);
    } finally {
      await this.repositoryService.release(queryRunner);
    }
  }

  private async saveUpdateScheduleCourse(
    request: PutScheduleCourseDto,
    updateSchedule: ScheduleModel,
    schedules: ScheduleModel[]
  ) {
    const queryRunner = await this.repositoryService.beginTransaction();
    try {
      // insert old schedule as blank
      // do not create blank schedule if original date fields are null
      // if (updateSchedule.startDate && updateSchedule.endDate) {
      //   if (
      //     this.getUtcDateString(request.startDate) !== this.getUtcDateString(updateSchedule.startDate) ||
      //     this.getUtcDateString(request.endDate) !== this.getUtcDateString(updateSchedule.endDate)
      //   ) {
      //     await this.scheduleRepository.insertSchedule(
      //       {
      //         cohortId: updateSchedule.cohortId,
      //         startDate: updateSchedule.startDate.toDateString(),
      //         endDate: updateSchedule.endDate.toDateString(),
      //         courseId: null,
      //         dayId: updateSchedule.dayId,
      //         instructorId: null,
      //         roomId: null,
      //       },
      //       queryRunner
      //     );
      //   }
      // }

      // if schedule is ongoing one, do not allow to update startDate -> ignore request.startDate
      const isOngoingSchedule = updateSchedule.startDate <= new Date() && new Date() <= updateSchedule.endDate;
      await Promise.all(
        schedules.map(async (schedule) => {
          if (schedule.id === request.scheduleId) {
            // update source schedule, clear roomId and instructorId
            await this.scheduleRepository.updateScheduleCourse(
              {
                id: schedule.id,
                startDate: isOngoingSchedule
                  ? this.getUtcDateString(schedule.startDate)
                  : this.getUtcDateString(request.startDate),
                endDate: this.getUtcDateString(request.endDate),
                courseId: request.courseId,
                dayId: request.dayId,
                instructorId: null,
                roomId: null,
              },
              queryRunner
            );
          } else {
            // update overlapped schedules (create blank schedules)
            // await this.scheduleRepository.updateScheduleCourse(
            //   {
            //     id: schedule.id,
            //     // if schedule is break, not update dates
            //     startDate: schedule.courseName === BREAK ? this.getUtcDateString(schedule.startDate) : null,
            //     endDate: schedule.courseName === BREAK ? this.getUtcDateString(schedule.endDate) : null,
            //     courseId: schedule.courseId,
            //     dayId: schedule.dayId,
            //     instructorId: null,
            //     roomId: null,
            //   },
            //   queryRunner
            // );
          }
        })
      );
      await this.repositoryService.commitTransaction(queryRunner);
    } catch (error) {
      await this.repositoryService.rollbackTransaction(queryRunner);
      throw new Error(error);
    } finally {
      await this.repositoryService.release(queryRunner);
    }
  }

  private getUtcDateString(date: Date | string | null): string | null {
    if (typeof date !== "string") {
      return date?.toISOString().substring(0, 10);
    } else {
      return date;
    }
  }

  // HACK: to prevent circular dependency between cohort and schedule service
  async getCurrentCourseHour(cohortId: string, courseId: string, scheduleId?: string) {
    return await this.cohortRepository.getCurrentCourseHour(cohortId, courseId, scheduleId);
  }

  async isExistsCohortId(cohortId: string) {
    const isExistsCohortId = await this.cohortRepository.isExistsCohortId(cohortId);
    if (!isExistsCohortId) {
      throw new NotFoundError(`Cohort id: ${cohortId} does not exist.`);
    }
  }
}
