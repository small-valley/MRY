import { Inject, Injectable } from "@nestjs/common";
import { BadRequestError } from "src/error/badRequest.error";
import { NotFoundError } from "src/error/notFound.error";
import { BREAK } from "src/repository/consts/course.const";
import { IProgramRepository } from "src/repository/interfaces/IProgramRepository";
import { IRepositoryService } from "src/repository/interfaces/IRepositoryService";
import { PostCourseRequest, PostProgramRequest } from "../../../../shared/models/requests/postProgramRequest";
import { PutProgramRequest } from "../../../../shared/models/requests/putProgramRequest";
import { GetProgramResponse } from "../../../../shared/models/responses/getProgramResponse";
import { CourseService } from "../course/course.service";

@Injectable()
export class ProgramService {
  @Inject("programRepository")
  private readonly programRepository: IProgramRepository;
  @Inject("repositoryService")
  private readonly repositoryService: IRepositoryService;
  @Inject(CourseService)
  private readonly courseService: CourseService;

  async findAll(): Promise<GetProgramResponse[]> {
    const programs = await this.programRepository.getPrograms();
    // exclude Break course -> filter in frontend
    const excludeBreak = programs.map((program) => {
      // const courses = program.courses.filter((course) => {
      //   return course.name !== BREAK;
      // });
      return { id: program.id, name: program.name, courses: program.courses };
    });
    return excludeBreak;
  }

  async create(request: PostProgramRequest) {
    this.checkBreakCourse(request.courses.map((course) => course.name));
    await this.checkDuplicateProgramName(request.name);
    await this.programRepository.createProgramAndCourses(request);
  }

  async createCourses(request: PostCourseRequest) {
    await this.isExistsProgramId(request.id);
    await this.courseService.checkDuplicateCourseName(request.courses.name, request.id, null);
    await this.courseService.createCourse(request);
  }

  async updateProgram(request: PutProgramRequest) {
    await this.isExistsProgramId(request.id);
    await this.checkDuplicateProgramName(request.name);
    await this.programRepository.updateProgram(request);
  }

  async deleteProgram(id: string) {
    await this.isExistsProgramId(id);
    const queryRunner = await this.repositoryService.beginTransaction();
    try {
      await this.courseService.deleteCourseByProgramId(id, queryRunner);
      await this.programRepository.deleteProgram(id, queryRunner);
      await this.repositoryService.commitTransaction(queryRunner);
    } catch (error) {
      await this.repositoryService.rollbackTransaction(queryRunner);
      throw error;
    } finally {
      await this.repositoryService.release(queryRunner);
    }
  }

  async checkDuplicateProgramName(name: string) {
    const isExistsProgramName = await this.programRepository.isExistsProgramName(name);
    if (isExistsProgramName) {
      throw new BadRequestError(`Program name: ${name} already exists`);
    }
  }

  async isExistsProgramId(programId: string): Promise<void | never> {
    const isExistsProgramId = await this.programRepository.isExistsProgramId(programId);
    if (!isExistsProgramId) {
      throw new NotFoundError(`Program id: ${programId} does not exist`);
    }
  }

  async isBelongsToTheSameProgramByCohortId(cohortId: string, courseId: string): Promise<void | never> {
    const isBelongingToTheSameProgram = await this.programRepository.isBelongingToTheSameProgramByCohortId(
      cohortId,
      courseId
    );
    if (!isBelongingToTheSameProgram) {
      throw new BadRequestError(`Cohort id: ${cohortId} and course id: ${courseId} do not belong to the same program.`);
    }
  }

  async isBelongsToTheSameProgramByProgramId(programId: string, courseId: string): Promise<void | never> {
    const isBelongingToTheSameProgram = await this.programRepository.isBelongingToTheSameProgramByProgramId(
      programId,
      courseId
    );
    if (!isBelongingToTheSameProgram) {
      throw new BadRequestError(`Course id: ${courseId} does not belong to the program with id: ${programId}.`);
    }
  }

  private checkBreakCourse(courseName: string[]) {
    if (courseName.includes(BREAK)) {
      throw new BadRequestError("Course name cannot be 'Break'");
    }
  }
}
