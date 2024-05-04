export interface PostCohortRequest {
  programId: string;
  cohortName: string;
  periodId: string;
  schedules: Schedule[];
}

export interface Schedule {
  startDate: string;
  endDate: string;
  courseId?: string;
  dayId?: string;
}
