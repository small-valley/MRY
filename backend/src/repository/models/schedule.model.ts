export interface ScheduleModel {
  id: string;
  cohortId: string;
  startDate: Date;
  endDate: Date;
  courseId: string;
  courseName?: string;
  dayId: string;
  instructorId: string;
  roomId: string;
}

export interface InsertScheduleModel extends Omit<ScheduleModel, "id" | "startDate" | "endDate"> {
  startDate: string;
  endDate: string;
}

export interface UpdateScheduleModel extends Omit<ScheduleModel, "cohortId" | "startDate" | "endDate"> {
  startDate: string;
  endDate: string;
}

export interface GetOngoingAndUpcomingScheduleModel extends Omit<ScheduleModel, "instructorId"> {
  todos: Todo[];
}

interface Todo {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  isCompleted: boolean;
}
