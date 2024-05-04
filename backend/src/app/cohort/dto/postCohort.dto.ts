import { ApiProperty } from "@nestjs/swagger";
import { PostCohortRequest, Schedule as ScheduleType } from "../../../../../shared/models/requests/postCohortRequest";

export class PostCohortDto implements PostCohortRequest {
  @ApiProperty()
  programId: string;
  @ApiProperty()
  cohortName: string;
  @ApiProperty()
  periodId: string;
  @ApiProperty({ type: () => [Schedule] })
  schedules: Schedule[];
}

class Schedule implements ScheduleType {
  @ApiProperty()
  startDate: string;
  @ApiProperty()
  endDate: string;
  @ApiProperty()
  courseId?: string;
  @ApiProperty()
  dayId?: string;
}
