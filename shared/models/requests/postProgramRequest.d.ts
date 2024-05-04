export interface PostProgramRequest {
  name: string;
  courses: Course[];
}

export interface Course {
  name: string;
  color: string;
  hour: number;
}

export interface PostCourseRequest {
  id: string;
  courses: Course;
}
