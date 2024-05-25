import { Body, Controller, Post, Put } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiTags } from "@nestjs/swagger";
import { AppController } from "src/app/app.controller";
import { PostTodoDto } from "./dto/postTodo.dto";
import { PutTodoDto } from "./dto/putTodo.dto";
import { TodoService } from "./todo.service";

@Controller("todos")
@ApiTags("todos")
@ApiBearerAuth("JWT")
export class TodoController extends AppController {
  constructor(private readonly todoService: TodoService) {
    super();
  }

  @Post()
  @ApiBody({ type: PostTodoDto })
  async createTodo(@Body() request: PostTodoDto) {
    await this.todoService.createTodo(request);
    return this.created();
  }

  @Put()
  @ApiBody({ type: PutTodoDto })
  async updateTodo(@Body() request: PutTodoDto) {
    await this.todoService.updateTodo(request);
    return this.ok(null);
  }
}
