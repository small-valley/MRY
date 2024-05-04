export interface GetDashboardResponse {
  ongoing: Ongoing[];
  upcoming: Upcoming[];
  today: Today[];
}

export interface Ongoing {
  cohortId: string;
  cohortName: string;
  courseName: string;
  period: string;
  day: string;
}

export interface Upcoming extends Ongoing {
  startDate: Date;
  todos: Todo[];
}

export interface Today extends Ongoing {
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
