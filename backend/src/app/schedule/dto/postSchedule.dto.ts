import { ApiProperty } from "@nestjs/swagger";
import { PostScheduleCourseRequest } from "../../../../../shared/models/requests/postScheduleRequest";

export class PostScheduleDto implements PostScheduleCourseRequest {
  @ApiProperty()
  cohortId: string;
  @ApiProperty()
  startDate: string;
  @ApiProperty()
  endDate: string;
  @ApiProperty()
  courseId: string;
  @ApiProperty()
  dayId: string;
}
