import { NotificationType } from "src/typeorm/entities/notification.entity";

export interface PostNotificationRequest {
  title: string;
  description?: string;
  type: NotificationType;
  senderId: string;
  receiverId?: string;
  userCapabilityDayId?: string;
  userCapabilityTimeId?: string;
  userCapabilityCourseId?: string;
  userDayoffId?: string;
  forDelete?: boolean;
}
