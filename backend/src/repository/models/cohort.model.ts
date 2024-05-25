export interface CohortModel {
  programId: string;
  programName: string;
  cohortId: string;
  cohortName: string;
  timeName: string;
  schedules: Schedule[];
}

export interface Schedule {
  scheduleId: string;
  startDate: Date;
  endDate: Date;
  courseId: string;
  courseName: string;
  dayId: string;
  dayName: string;
  dayHoursPerWeek: number;
  userId: string;
  userFirstName: string;
  roomId: string;
  roomName: string;
  currentHour: number;
  courseHour: number;
}

export interface RecentCohortModel {
  cohortId: string;
  cohortName: string;
}

export interface CurrrentCourseHour {
  courseId: string;
  currentHour: number;
  courseHour: number;
}

export interface InsertCohortModel {
  programId: string;
  name: string;
  timeId: string;
  intake: string;
  studentCount: number;
}
