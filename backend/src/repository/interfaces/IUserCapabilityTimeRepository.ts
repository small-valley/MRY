import { PostUserCapabilityTimeRequest } from '../../../../shared/models/requests/postUserCapabilityTimeRequest';

export interface IUserCapabilityTimeRepository {
  createUserCapabilityTime({ userId, timeId, isDraft }: PostUserCapabilityTimeRequest): Promise<void>;
  updateUserCapabilityTime(UserCapabilityTimeId: string): Promise<void>;
  deleteUserCapabilityTime(UserCapabilityTimeId: string): Promise<void>;
}
