import { QueryRunner } from "typeorm";
import { GetProgramModel, PostProgramModel, PutProgramModel } from "../models/program.model";

export interface IProgramRepository {
  getPrograms(): Promise<GetProgramModel[]>;
  createProgramAndCourses(model: PostProgramModel): Promise<void>;
  updateProgram(model: PutProgramModel): Promise<void>;
  deleteProgram(id: string, queryRunner?: QueryRunner): Promise<void>;
  isExistsProgramName(name: string): Promise<boolean>;
  isExistsProgramId(id: string): Promise<boolean>;
  isBelongingToTheSameProgramByCohortId(cohortId: string, courseId: string): Promise<boolean>;
  isBelongingToTheSameProgramByProgramId(programId: string, courseId: string): Promise<boolean>;
}
