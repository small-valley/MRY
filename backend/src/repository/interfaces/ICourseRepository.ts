import { QueryRunner } from "typeorm";
import { CourseModel } from "../models/course.model";
import { PostCourseModel, PutCourseModel } from "../models/program.model";

export interface ICourseRepository {
  createCourse(model: PostCourseModel): Promise<void>;
  updateCourse(model: PutCourseModel): Promise<void>;
  deleteCourse(id: string): Promise<void>;
  deleteCourseByProgramId(programId: string, queryRunner?: QueryRunner): Promise<void>;
  isExistsCourseId(id: string): Promise<boolean>;
  isExistsCourseName(name: string, programId?: string, courseId?: string): Promise<boolean>;
  getCourse(courseId: string): Promise<CourseModel | null>;
}
