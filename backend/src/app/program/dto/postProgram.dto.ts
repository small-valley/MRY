import { ApiProperty } from "@nestjs/swagger";
import {
  Course as ICourse,
  PostCourseRequest,
  PostProgramRequest,
} from "../../../../../shared/models/requests/postProgramRequest";

export class PostProgramDto implements PostProgramRequest {
  @ApiProperty()
  name: string;
  @ApiProperty({ type: () => [Course] })
  courses: Course[];
}

class Course implements ICourse {
  @ApiProperty()
  name: string;
  @ApiProperty()
  color: string;
  @ApiProperty()
  hour: number;
}

export class PostCoursesDto implements PostCourseRequest {
  @ApiProperty()
  id: string;
  @ApiProperty()
  courses: Course;
}
