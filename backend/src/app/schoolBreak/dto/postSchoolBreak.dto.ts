import { ApiProperty } from "@nestjs/swagger";
import { PostSchoolBreakRequest } from "../../../../../shared/models/requests/postSchoolBreakRequest";

export class PostSchoolBreakDto implements PostSchoolBreakRequest {
  @ApiProperty()
  name: string;
  @ApiProperty()
  startDate: string;
  @ApiProperty()
  endDate: string;
}
