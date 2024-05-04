import { Inject, Injectable } from "@nestjs/common";
import { ISchoolBreakRepository } from "src/repository/interfaces/ISchoolBreakRepository";
import { PostSchoolBreakDto } from "./dto/postSchoolBreak.dto";
import { PostSchoolBreakResponse } from "../../../../shared/models/responses/postSchoolBreakResponse";
import { GetSchoolBreaksResponse } from "../../../../shared/models/responses/getSchoolBreaksResponse";

@Injectable()
export class SchoolBreakService {
  @Inject("schoolBreakRepository")
  private readonly schoolBreakRepository: ISchoolBreakRepository;

  async getSchoolBreaks(): Promise<GetSchoolBreaksResponse[]> {
    return await this.schoolBreakRepository.getSchoolBreaks();
  }

  async createSchoolBreak(request: PostSchoolBreakDto): Promise<PostSchoolBreakResponse> {
    return await this.schoolBreakRepository.createSchoolBreak(request);
  }

  async deleteSchoolBreak(schoolBreakId: string): Promise<void> {
    await this.schoolBreakRepository.deleteSchoolBreak(schoolBreakId);
  }
}
