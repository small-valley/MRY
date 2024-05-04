export interface GetCohortResponse {
  programId: string;
  program: string;
  cohortId: string;
  name: string;
  period: string;
  course: Course[];
}

interface Course {
  scheduleId: string;
  startDate: Date;
  endDate: Date;
  courseId: string;
  name: string;
  dayId: string;
  days: string;
  instructorId: string;
  instructor: string;
  status: 'upcoming' | 'ongoing' | 'finished' | 'break';
  roomId: string;
  room: string;
  currentHour: number;
  courseHour: number;
}
