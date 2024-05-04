import { ApiProperty } from "@nestjs/swagger";
import {
  PutCourseRequest,
  PutProgramRequest,
} from "../../../../../shared/models/requests/putProgramRequest";

export class PutProgramDto implements PutProgramRequest {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
}

export class PutCourseDto implements PutCourseRequest {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  color: string;
  @ApiProperty()
  hour: number;
}
