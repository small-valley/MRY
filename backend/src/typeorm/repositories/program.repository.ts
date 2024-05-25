import { InjectRepository } from "@nestjs/typeorm";
import { BREAK } from "src/repository/consts/course.const";
import { IProgramRepository } from "src/repository/interfaces/IProgramRepository";
import { PostProgramModel, PutProgramModel } from "src/repository/models/program.model";
import { QueryRunner, Repository } from "typeorm";
import { Colors, Course } from "../entities/course.entity";
import { Program } from "../entities/program.entity";

export class ProgramRepository implements IProgramRepository {
  constructor(
    @InjectRepository(Program)
    private programRepository: Repository<Program>
  ) {}

  async getPrograms(): Promise<Program[]> {
    const programs = await this.programRepository
      .createQueryBuilder("program")
      .innerJoin("program.courses", "course", "program.id = course.program_id")
      .select(["program.id", "program.name", "course.id", "course.name", "course.color", "course.hour"])
      .where("program.is_deleted = false")
      .andWhere("course.is_deleted = false")
      .orderBy("program.name", "ASC")
      .addOrderBy("course.name", "ASC")
      .getMany();
    return programs;
  }

  async createProgramAndCourses(model: PostProgramModel) {
    const breakCourse = new Course();
    breakCourse.name = BREAK;
    breakCourse.color = Colors.GRAY;
    breakCourse.hour = 0;

    const program = this.programRepository.create({
      name: model.name,
      courses: [
        ...model.courses.map((course) => {
          const newCourse = new Course();
          newCourse.name = course.name;
          newCourse.color = course.color as Colors;
          newCourse.hour = course.hour;
          return newCourse;
        }),
        // add Break course by default
        breakCourse,
      ],
    });

    await this.programRepository.save(program);
  }

  async updateProgram(model: PutProgramModel) {
    await this.programRepository.update(model.id, { name: model.name });
  }

  async deleteProgram(id: string, queryRunner: QueryRunner) {
    const repository = queryRunner ? queryRunner.manager.getRepository(Program) : this.programRepository;
    await repository.delete(id);
  }

  async isExistsProgramId(id: string): Promise<boolean> {
    return await this.programRepository.exists({
      where: { id, isDeleted: false },
    });
  }

  async isExistsProgramName(name: string): Promise<boolean> {
    return await this.programRepository.exists({
      where: { name, isDeleted: false },
    });
  }

  async isBelongingToTheSameProgramByCohortId(cohortId: string, courseId: string): Promise<boolean> {
    return await this.programRepository
      .createQueryBuilder("program")
      .innerJoin("cohorts", "cohort", "program.id = cohort.program_id AND cohort.is_deleted = false")
      .innerJoin("courses", "course", "program.id = course.program_id AND course.is_deleted = false")
      .where("cohort.id = :cohortId", { cohortId })
      .andWhere("course.id = :courseId", { courseId })
      .getExists();
  }

  async isBelongingToTheSameProgramByProgramId(programId: string, courseId: string): Promise<boolean> {
    return await this.programRepository
      .createQueryBuilder("program")
      .innerJoin("courses", "course", "program.id = course.program_id AND course.is_deleted = false")
      .where("program.id = :programId", { programId })
      .andWhere("course.id = :courseId", { courseId })
      .getExists();
  }
}
