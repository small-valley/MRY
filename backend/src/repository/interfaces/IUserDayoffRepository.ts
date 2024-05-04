import { PostUserDayoffRequest } from '../../../../shared/models/requests/postUserDayoffRequest';

export interface IUserDayoffRepository {
  getUserDayoff(userId: string);
  createUserDayoff({ userId, startDate, endDate, isDraft }: PostUserDayoffRequest);
  updateUserDayoff(UserDayoffId: string): Promise<void>;
  deleteUserDayoff(UserDayoffId: string): Promise<void>;
}
