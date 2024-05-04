import { InjectRepository } from "@nestjs/typeorm";
import { ITodoRepository } from "src/repository/interfaces/ITodoRepository";
import {
  GetTodoModel,
  PostTodoModel,
  PutTodoModel,
} from "src/repository/models/todo.model";
import { Repository } from "typeorm";
import { Todo } from "../entities/todo.entity";

export class TodoRepository implements ITodoRepository {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>
  ) {}

  async getTodosByScheduleId(scheduleId: string): Promise<GetTodoModel[]> {
    return await this.todoRepository.find({
      where: { scheduleId },
      select: ["id", "title", "description", "dueDate", "isCompleted"],
      order: { dueDate: "ASC", title: "ASC" },
    });
  }

  async createTodo(model: PostTodoModel): Promise<void> {
    await this.todoRepository.insert(model);
  }

  async isExistsTodoId(todoId: string): Promise<boolean> {
    return await this.todoRepository.exists({
      where: { id: todoId, isDeleted: false },
    });
  }

  async updateTodo(model: PutTodoModel): Promise<void> {
    await this.todoRepository.update(model.id, model);
  }
}
