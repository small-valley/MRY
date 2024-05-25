import { InjectRepository } from "@nestjs/typeorm";
import { ITodoRepository } from "src/repository/interfaces/ITodoRepository";
import { GetTodoModel, PostTodoModel, PutTodoModel } from "src/repository/models/todo.model";
import { QueryRunner, Repository } from "typeorm";
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

  async createTodosFromTemplate(scheduleId: string[], queryRunner?: QueryRunner): Promise<void> {
    return await this.getRepository(queryRunner).query(`
    INSERT INTO todos (schedule_id, title, description, due_date)
    SELECT
      schedule.id,
      pt.title,
      pt.description,
      schedule.start_date --due_date
    FROM preset_todos pt
    INNER JOIN (
      SELECT
        id,
        start_date
      FROM schedules
      WHERE id IN (${scheduleId.map((id) => `'${id}'`).join(",")})
    ) schedule
    ON true -- cross join
    `);
  }

  async isExistsTodoId(todoId: string): Promise<boolean> {
    return await this.todoRepository.exists({
      where: { id: todoId, isDeleted: false },
    });
  }

  async updateTodo(model: PutTodoModel): Promise<void> {
    await this.todoRepository.update(model.id, model);
  }

  async deleteTodo(scheduleId: string, queryRunner?: QueryRunner): Promise<void> {
    await this.getRepository(queryRunner).delete({ scheduleId });
  }

  getRepository(queryRunner?: QueryRunner) {
    return queryRunner ? queryRunner.manager.getRepository(Todo) : this.todoRepository;
  }
}
