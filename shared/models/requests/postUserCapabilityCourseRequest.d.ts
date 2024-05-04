export interface PostUserCapabilityCourseRequest {
  userId: string;
  courseId: string;
  isPreference?: boolean;
  isDraft?: boolean;
}
