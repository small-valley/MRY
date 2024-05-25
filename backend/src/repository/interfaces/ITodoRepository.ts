import { PostTodoDto } from "src/app/todo/dto/postTodo.dto";
import { QueryRunner } from "typeorm";
import { GetTodoModel, PutTodoModel } from "../models/todo.model";

export interface ITodoRepository {
  getTodosByScheduleId(scheduleId: string): Promise<GetTodoModel[]>;
  createTodo(request: PostTodoDto): Promise<void>;
  isExistsTodoId(todoId: string): Promise<boolean>;
  updateTodo(model: PutTodoModel): Promise<void>;
  createTodosFromTemplate(scheduleId: string[], queryRunner?: QueryRunner): Promise<void>;
  deleteTodo(scheduleId: string, queryRunner?: QueryRunner): Promise<void>;
}
