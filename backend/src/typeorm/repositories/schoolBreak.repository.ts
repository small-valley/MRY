import { InjectRepository } from "@nestjs/typeorm";
import { ISchoolBreakRepository } from "src/repository/interfaces/ISchoolBreakRepository";
import { Repository } from "typeorm";
import { SchoolBreak } from "../entities/school_break.entity";
import { PostSchoolBreakRequest } from "../../../../shared/models/requests/postSchoolBreakRequest";
import { PostSchoolBreakResponse } from "../../../../shared/models/responses/postSchoolBreakResponse";
import { GetSchoolBreaksResponse } from "../../../../shared/models/responses/getSchoolBreaksResponse";

export class SchoolBreakRepository implements ISchoolBreakRepository {
  constructor(
    @InjectRepository(SchoolBreak)
    private SchoolBreakRepository: Repository<SchoolBreak>,
  ) { }

  async getSchoolBreaks(): Promise<GetSchoolBreaksResponse[]> {
    const schoolBreaks = await this.SchoolBreakRepository.createQueryBuilder("school_break")
      .andWhere("school_break.isDeleted = :isDeleted", { isDeleted: false })
      .select(["school_break.id", "school_break.name", "school_break.startDate", "school_break.endDate"])
      .orderBy("school_break.startDate", "ASC")
      .getMany();

    return schoolBreaks.map((schoolBreak) => ({
      id: schoolBreak.id,
      name: schoolBreak.name,
      startDate: schoolBreak.startDate,
      endDate: schoolBreak.endDate,
    }));
  }

  async createSchoolBreak(request: PostSchoolBreakRequest): Promise<PostSchoolBreakResponse> {
    const schoolBreak = new SchoolBreak();
    schoolBreak.name = request.name;
    schoolBreak.startDate = new Date(request.startDate);
    schoolBreak.endDate = new Date(request.endDate);
    await this.SchoolBreakRepository.save(schoolBreak);
    return {
      id: schoolBreak.id,
      name: schoolBreak.name,
      startDate: schoolBreak.startDate,
      endDate: schoolBreak.endDate,
    };
  }

  async deleteSchoolBreak(schoolBreakId: string): Promise<void> {
    const schoolBreak = await this.SchoolBreakRepository.createQueryBuilder("school_break")
      .where("school_break.id = :id", { id: schoolBreakId })
      .getOne();
    schoolBreak.isDeleted = true;
    await this.SchoolBreakRepository.save(schoolBreak);
  }
}
