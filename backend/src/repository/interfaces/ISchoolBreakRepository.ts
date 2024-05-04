import { PostSchoolBreakDto } from "src/app/schoolBreak/dto/postSchoolBreak.dto";
import { GetSchoolBreaksResponse } from "../../../../shared/models/responses/getSchoolBreaksResponse";
import { PostSchoolBreakResponse } from "../../../../shared/models/responses/postSchoolBreakResponse";

export interface ISchoolBreakRepository {
  getSchoolBreaks(): Promise<GetSchoolBreaksResponse[]>;
  createSchoolBreak(request: PostSchoolBreakDto): Promise<PostSchoolBreakResponse>;
  deleteSchoolBreak(schoolBreakId: string): Promise<void>;
}
