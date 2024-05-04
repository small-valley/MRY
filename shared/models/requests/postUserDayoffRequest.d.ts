export interface PostUserDayoffRequest {
  userId: string;
  startDate: Date;
  endDate: Date;
  isDraft?: boolean;
}
