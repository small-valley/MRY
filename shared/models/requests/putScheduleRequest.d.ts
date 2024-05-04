export interface PutScheduleInstructorOrRoomRequest {
  scheduleId: string;
  instructorId?: string;
  roomId?: string;
}

export interface PutScheduleCourseRequest {
  scheduleId: string;
  startDate: string;
  endDate: string;
  courseId?: string;
  dayId?: string;
}
