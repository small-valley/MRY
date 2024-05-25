import { InjectRepository } from "@nestjs/typeorm";
import { IDashboardRepository } from "src/repository/interfaces/IDashboardRepository";
import { DashboardModel } from "src/repository/models/dashboard.model";
import { Repository } from "typeorm";
import { Cohort } from "../entities/cohort.entity";

export class DashboardRepository implements IDashboardRepository {
  constructor(
    @InjectRepository(Cohort)
    private cohortRepository: Repository<Cohort>
  ) {}

  async getDashboard(userId?: string): Promise<DashboardModel[]> {
    const cohorts = (await this.cohortRepository
      .createQueryBuilder("cohort")
      .innerJoin("times", "time", "cohort.time_id = time.id AND time.is_deleted = false")
      .innerJoin("schedules", "schedule", "cohort.id = schedule.cohort_id AND schedule.is_deleted = false")
      .leftJoin("courses", "course", "schedule.course_id = course.id AND course.is_deleted = false")
      .leftJoin("days", "day", "schedule.day_id = day.id AND day.is_deleted = false")
      .leftJoin("todos", "todo", "schedule.id = todo.schedule_id AND todo.is_deleted = false")
      .leftJoin("rooms", "room", "schedule.room_id = room.id AND room.is_deleted = false")
      .leftJoin("users", "user", "schedule.user_id = user.id AND user.is_deleted = false")
      .where("NOW() <= schedule.end_date")
      // if userId is not provided, return all cohorts for manager role user
      .andWhere(userId ? "schedule.user_id = :userId" : "1=1", { userId })
      .select([
        "cohort.id",
        "cohort.name",
        "course.name",
        "time.name",
        "day.name",
        "schedule.id",
        "schedule.start_date",
        "schedule.end_date",
        "user.first_name",
        "room.name",
        "todo.id",
        "todo.title",
        "todo.description",
        "todo.due_date",
        "todo.is_completed",
      ])
      .orderBy("schedule.start_date", "DESC")
      .addOrderBy("cohort.name", "DESC")
      .addOrderBy("todo.title", "ASC")
      .getRawMany()) as CohortResult[];

    return this.convertToDashboardModel(cohorts);
  }

  private convertToDashboardModel(cohorts: CohortResult[]): DashboardModel[] {
    let dashboardModel: DashboardModel[] = [];

    cohorts.forEach((cohort) => {
      const existingCohort = dashboardModel.find(
        (c) => c.cohortId === cohort.cohort_id && c.scheduleId === cohort.schedule_id
      );
      if (existingCohort) {
        const existingTodo = existingCohort.todos.find((t) => t.id === cohort.todo_id);
        if (!existingTodo && cohort.todo_id) {
          existingCohort.todos.push({
            id: cohort.todo_id,
            title: cohort.todo_title,
            description: cohort.todo_description,
            dueDate: cohort.due_date,
            isCompleted: cohort.is_completed,
          });
        }
      } else {
        const todo = {
          id: cohort.todo_id,
          title: cohort.todo_title,
          description: cohort.todo_description,
          dueDate: cohort.due_date,
          isCompleted: cohort.is_completed,
        };
        dashboardModel.push({
          cohortId: cohort.cohort_id,
          cohortName: cohort.cohort_name,
          period: cohort.time_name,
          scheduleId: cohort.schedule_id,
          courseName: cohort.course_name,
          day: cohort.day_name,
          room: cohort.room_name,
          startDate: cohort.start_date,
          endDate: cohort.end_date,
          instructor: cohort.first_name,
          todos: todo.id ? [todo] : [],
        });
      }
    });

    return dashboardModel;
  }
}

/*
 * Custom return type for getCohort query
 */
interface CohortResult {
  cohort_id: string;
  cohort_name: string;
  course_name: string;
  time_name: string;
  day_name: string;
  start_date: Date;
  end_date: Date;
  schedule_id: string;
  first_name: string;
  room_name: string;
  todo_id: string;
  todo_title: string;
  todo_description: string;
  due_date: Date;
  is_completed: boolean;
}
