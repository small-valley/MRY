import { InjectRepository } from "@nestjs/typeorm";
import { BREAK } from "src/repository/consts/course.const";
import { ICourseRepository } from "src/repository/interfaces/ICourseRepository";
import { CourseModel } from "src/repository/models/course.model";
import { PostCourseModel, PutCourseModel } from "src/repository/models/program.model";
import { QueryRunner, Repository } from "typeorm";
import { Colors, Course } from "../entities/course.entity";

export class CourseRepository implements ICourseRepository {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>
  ) {}

  async createCourse(model: PostCourseModel) {
    const course = this.courseRepository.create({
      programId: model.id,
      name: model.courses.name,
      color: model.courses.color as Colors,
      hour: model.courses.hour,
    });
    await this.courseRepository.save(course);
  }

  async updateCourse(model: PutCourseModel) {
    // exclude creating Break course
    if (model.name !== BREAK) {
      await this.courseRepository.update(model.id, {
        name: model.name,
        color: model.color as Colors,
        hour: model.hour,
      });
    }
  }

  async deleteCourse(id: string) {
    await this.courseRepository.delete(id);
  }

  async deleteCourseByProgramId(programId: string, queryRunner?: QueryRunner) {
    const repository = queryRunner ? queryRunner.manager.getRepository(Course) : this.courseRepository;
    await repository.delete({ programId: programId });
  }

  async isExistsCourseName(name: string, programId?: string, courseId?: string): Promise<boolean> {
    return await this.courseRepository
      .createQueryBuilder("course")
      .where("course.name = :name", { name })
      .andWhere(programId ? "course.program_id = :programId" : "1=1", { programId })
      .andWhere(courseId ? `course.program_id IN(SELECT program_id FROM courses WHERE id = :courseId)` : "1=1", {
        courseId,
      })
      .andWhere(courseId ? `course.id <> :courseId` : "1=1", { courseId })
      .getExists();
  }

  async isExistsCourseId(courseId: string): Promise<boolean> {
    return await this.courseRepository.exists({
      where: { id: courseId, isDeleted: false },
    });
  }

  async getCourse(courseId: string): Promise<CourseModel | null> {
    return await this.courseRepository.findOne({
      where: { id: courseId, isDeleted: false },
      select: ["id", "hour"],
    });
  }
}
