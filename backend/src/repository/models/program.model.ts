export interface GetProgramModel {
  id: string;
  name: string;
  courses: {
    id: string;
    name: string;
    color: string;
    hour: number;
  }[];
}

export interface PostProgramModel {
  name: string;
  courses: {
    name: string;
    color: string;
    hour: number;
  }[];
}

export interface PostCourseModel {
  id: string;
  courses: {
    name: string;
    color: string;
    hour: number;
  };
}

export interface PutProgramModel extends Omit<GetProgramModel, "courses"> {}

export interface PutCourseModel {
  id: string;
  name: string;
  color: string;
  hour: number;
}
