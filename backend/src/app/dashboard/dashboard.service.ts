import { Inject, Injectable } from "@nestjs/common";
import { IDashboardRepository } from "src/repository/interfaces/IDashboardRepository";
import { IUserRepository } from "src/repository/interfaces/IUserRepository";
import { GetDashboardResponse } from "../../../../shared/models/responses/getDashboardResponse";

@Injectable()
export class DashboardService {
  @Inject("dashboardRepository")
  private readonly dashboardRepository: IDashboardRepository;
  @Inject("userRepository")
  private readonly userRepository: IUserRepository;

  async getDashboard(userId: string, role: string): Promise<GetDashboardResponse> {
    const dashboard = await this.dashboardRepository.getDashboard(role === "manager" ? null : userId);
    const mostRecentSchedule = dashboard
      .filter((cohort) => new Date() < cohort.startDate)
      .sort((a, b) => {
        return a.startDate.getTime() - b.startDate.getTime();
      })
      .slice(0, 1);
    return {
      ongoing: dashboard
        .filter((cohort) => cohort.startDate <= new Date())
        .map((cohort) => {
          return {
            cohortId: cohort.cohortId,
            scheduleId: cohort.scheduleId,
            cohortName: cohort.cohortName,
            courseName: cohort.courseName,
            period: cohort.period,
            day: cohort.day,
            startDate: cohort.startDate,
            endDate: cohort.endDate,
            todos: cohort.todos.map((todo) => {
              return {
                id: todo.id,
                title: todo.title,
                description: todo.description,
                dueDate: todo.dueDate,
                isCompleted: todo.isCompleted,
              };
            }),
          };
        }),
      upcoming: dashboard
        .filter(
          (cohort) =>
            cohort.startDate.getFullYear() === mostRecentSchedule[0].startDate.getFullYear() &&
            cohort.startDate.getMonth() === mostRecentSchedule[0].startDate.getMonth() &&
            cohort.startDate.getDate() === mostRecentSchedule[0].startDate.getDate()
        )
        .map((cohort) => {
          return {
            cohortId: cohort.cohortId,
            scheduleId: cohort.scheduleId,
            cohortName: cohort.cohortName,
            courseName: cohort.courseName,
            period: cohort.period,
            day: cohort.day,
            startDate: cohort.startDate,
            endDate: cohort.endDate,
            todos: cohort.todos.map((todo) => {
              return {
                id: todo.id,
                title: todo.title,
                description: todo.description,
                dueDate: todo.dueDate,
                isCompleted: todo.isCompleted,
              };
            }),
          };
        }),
      today: dashboard
        .filter((cohort) => cohort.startDate <= new Date())
        .map((cohort) => {
          return {
            cohortId: cohort.cohortId,
            cohortName: cohort.cohortName,
            courseName: cohort.courseName,
            period: cohort.period,
            day: cohort.day,
            startDate: cohort.startDate,
            endDate: cohort.endDate,
            room: cohort.room,
            instructor: cohort.instructor,
          };
        }),
    };
  }
}
