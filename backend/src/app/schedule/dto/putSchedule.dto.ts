import { ApiProperty } from "@nestjs/swagger";
import {
  PutScheduleCourseRequest,
  PutScheduleInstructorOrRoomRequest,
} from "../../../../../shared/models/requests/putScheduleRequest";

export class PutScheduleInstructorOrRoomDto implements PutScheduleInstructorOrRoomRequest {
  @ApiProperty()
  scheduleId: string;
  @ApiProperty()
  instructorId?: string;
  @ApiProperty()
  roomId?: string;
}

export class PutScheduleCourseDto implements PutScheduleCourseRequest {
  @ApiProperty()
  scheduleId: string;
  @ApiProperty()
  startDate: string;
  @ApiProperty()
  endDate: string;
  @ApiProperty()
  courseId?: string;
  @ApiProperty()
  dayId?: string;
}
