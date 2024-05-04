import { Schedule } from "../../shared/models/responses/getCohortsResponse";

export type monthlyCohort = {
  program: string;
  name: string;
  room: string;
  period: string;
  schedules: Schedule[];
};
export type returnMonthlyCohort = {
  baseDate: string;
  name: string;
  period: string;
  room: string;
  schedules: Schedule[];
};

export type ProgramList = {
  name: string;
  program: string;
  progress: number;
  schedulescnt: number;
  period: string;
  room: string;
  startDate: string;
  endDate: string;
  status: string;
};

export type Todo = {
  id: string;
  title: string;
  dueDate: string;
  isCompleted: boolean;
};

export type instructor = {
  id: string;
  firstName: string;
  lastName: string;
  avatar_url: string;
};

export type instructorDetail = {
  id: string;
  firstName: string;
  lastName: string;
  avatar_url: string;
  isActive: boolean;
  hours: number;
  days: string[];
  period: string[];
  schedules: instructorSchedule[];
  preference: instructorSchedule[];
};

export type instructorSchedule = {
  program: string;
  name: string;
  color: string;
};

export type ProgramType = {
  name: string;
  course: ProgramCourse[];
};

export type ProgramCourse = {
  title: string;
  color: string;
  hour: number;
};
