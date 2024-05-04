import { ApiProperty } from "@nestjs/swagger";
import { PostTodoRequest } from "../../../../../shared/models/requests/postTodoRequest";

export class PostTodoDto implements PostTodoRequest {
  @ApiProperty()
  scheduleId: string;
  @ApiProperty()
  title: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  dueDate: Date;
}
