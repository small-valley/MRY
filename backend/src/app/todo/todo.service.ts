import { Inject, Injectable } from "@nestjs/common";
import { NotFoundError } from "src/error/notFound.error";
import { ITodoRepository } from "src/repository/interfaces/ITodoRepository";
import { Todo } from "../../../../shared/models/responses/getAvailabilityResponse";
import { ScheduleService } from "../schedule/schedule.service";
import { PostTodoDto } from "./dto/postTodo.dto";
import { PutTodoDto } from "./dto/putTodo.dto";

@Injectable()
export class TodoService {
  @Inject("todoRepository")
  private readonly todoRepository: ITodoRepository;
  @Inject(ScheduleService)
  private readonly scheduleService: ScheduleService;

  getTodosByScheduleId(scheduleId: string): Promise<Todo[]> {
    return this.todoRepository.getTodosByScheduleId(scheduleId);
  }

  async createTodo(request: PostTodoDto): Promise<void> {
    await this.scheduleService.isExistsScheduleId(request.scheduleId);
    await this.todoRepository.createTodo(request);
  }

  async updateTodo(request: PutTodoDto): Promise<void> {
    const isExistsTodoId = await this.todoRepository.isExistsTodoId(
      request.todoId
    );
    if (!isExistsTodoId) {
      throw new NotFoundError(`Todo id: ${request.todoId} does not exist`);
    }
    const putTodoModel = {
      ...request,
      id: request.todoId,
      todoId: undefined,
    };
    await this.todoRepository.updateTodo(putTodoModel);
  }
}
