export interface GetProgramResponse {
  id: string;
  name: string;
  courses: {
    id: string;
    name: string;
    color: string;
    hour: number;
  }[];
}
