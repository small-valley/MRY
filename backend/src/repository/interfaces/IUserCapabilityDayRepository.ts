import { PostUserCapabilityDayRequest } from '../../../../shared/models/requests/postUserCapabilityDayRequest';

export interface IUserCapabilityDayRepository {
  createUserCapabilityDay({ userId, dayId, isDraft }: PostUserCapabilityDayRequest): Promise<{ userCapabilityDayId: string }>;
  updateUserCapabilityDay(UserCapabilityDayId: string): Promise<void>;
  deleteUserCapabilityDay(UserCapabilityDayId: string): Promise<void>;
}
