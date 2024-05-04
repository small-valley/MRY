import { PostUserCapabilityCourseRequest } from '../../../../shared/models/requests/postUserCapabilityCourseRequest';

export interface IUserCapabilityCourseRepository {
  createUserCapabilityCourse({userId, courseId, isPreference, isDraft}: PostUserCapabilityCourseRequest): Promise<void>;
  updateUserCapabilityCourse(UserCapabilityCourseId: string): Promise<void>;
  deleteUserCapabilityCourse(UserCapabilityCourseId: string): Promise<void>;
}
