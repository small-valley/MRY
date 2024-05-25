import { Inject, Injectable } from "@nestjs/common";
import { BadRequestError } from "src/error/badRequest.error";
import { NotFoundError } from "src/error/notFound.error";
import { ICourseRepository } from "src/repository/interfaces/ICourseRepository";
import { CourseModel } from "src/repository/models/course.model";
import { QueryRunner } from "typeorm";
import { PostCourseRequest } from "../../../../shared/models/requests/postProgramRequest";
import { PutCourseRequest } from "../../../../shared/models/requests/putProgramRequest";

@Injectable()
export class CourseService {
  @Inject("courseRepository")
  private readonly courseRepository: ICourseRepository;

  async createCourse(request: PostCourseRequest) {
    await this.courseRepository.createCourse(request);
  }

  async updateCourse(request: PutCourseRequest) {
    await this.isExistsCourseId(request.id);
    await this.checkDuplicateCourseName(request.name, null, request.id);
    await this.courseRepository.updateCourse(request);
  }

  async deleteCourse(courseId: string) {
    await this.isExistsCourseId(courseId);
    await this.courseRepository.deleteCourse(courseId);
  }

  async deleteCourseByProgramId(programId: string, queryRunner?: QueryRunner) {
    await this.courseRepository.deleteCourseByProgramId(programId, queryRunner);
  }

  async checkDuplicateCourseName(name: string, programId?: string, courseId?: string) {
    const isExistsCourseName = await this.courseRepository.isExistsCourseName(name, programId, courseId);
    if (isExistsCourseName) {
      throw new BadRequestError(`course name: ${name} already exists`);
    }
  }

  async isExistsCourseId(courseId: string): Promise<void | never> {
    const isExistsCourseId = await this.courseRepository.isExistsCourseId(courseId);
    if (!isExistsCourseId) {
      throw new NotFoundError(`Course id: ${courseId} does not exist`);
    }
  }

  async getCourse(courseId: string): Promise<CourseModel | null> {
    const course = await this.courseRepository.getCourse(courseId);
    if (!course) {
      throw new NotFoundError(`Course id: ${courseId} does not exist`);
    }
    return course;
  }
}
