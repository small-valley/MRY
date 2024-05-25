export interface GetDashboardResponse {
  ongoing: Ongoing[];
  upcoming: Upcoming[];
  today: Today[];
}

export interface Ongoing {
  cohortId: string;
  scheduleId: string;
  cohortName: string;
  courseName: string;
  period: string;
  startDate: Date;
  endDate: Date;
  day: string;
  todos: Todo[];
}

export interface Upcoming extends Ongoing {}

export interface Today extends Omit<Ongoing, 'scheduleId' | 'todos'> {
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
