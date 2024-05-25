export interface DashboardModel {
  cohortId: string;
  cohortName: string;
  scheduleId: string;
  courseName: string;
  period: string;
  day: string;
  startDate: Date;
  endDate: Date;
  todos: Todo[];
  room: string;
  instructor: string;
}

export interface Todo {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  isCompleted: boolean;
}
