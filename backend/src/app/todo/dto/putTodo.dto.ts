import { ApiProperty } from "@nestjs/swagger";
import { PutTodoRequest } from "../../../../../shared/models/requests/putTodoRequest";

export class PutTodoDto implements PutTodoRequest {
  @ApiProperty()
  todoId: string;
  @ApiProperty()
  title: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  dueDate: Date;
  @ApiProperty()
  isCompleted: boolean;
}
