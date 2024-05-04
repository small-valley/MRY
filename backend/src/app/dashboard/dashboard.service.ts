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

  async getDashboard(): Promise<GetDashboardResponse> {
    const dashboard = await this.dashboardRepository.getDashboard();
    return {
      ongoing: dashboard
        .filter((cohort) => cohort.startDate <= new Date())
        .map((cohort) => {
          return {
            cohortId: cohort.cohortId,
            cohortName: cohort.cohortName,
            courseName: cohort.courseName,
            period: cohort.period,
            day: cohort.day,
          };
        }),
      upcoming: dashboard
        .filter((cohort) => new Date() < cohort.startDate)
        .map((cohort) => {
          return {
            cohortId: cohort.cohortId,
            cohortName: cohort.cohortName,
            courseName: cohort.courseName,
            period: cohort.period,
            day: cohort.day,
            startDate: cohort.startDate,
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
        })
        .sort((a, b) => {
          return a.startDate.getTime() - b.startDate.getTime();
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
            room: cohort.room,
            instructor: cohort.instructor,
          };
        }),
    };
  }
}
