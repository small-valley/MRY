import { GetNotificationRequest } from "../../../../shared/models/requests/getNotificationRequest";
import { PostNotificationRequest } from "../../../../shared/models/requests/postNotificationRequest";
import {
  GetNotificationModel,
} from "../models/notification.model";
import { GetNotificationBySenderRequest } from "../../../../shared/models/requests/getNotificationBySenderRequest";


export interface INotificationRepository {
  getNotifications(
    { receiverId, type, startDate, endDate }: GetNotificationRequest
  ): Promise<GetNotificationModel[]>;
  getNotificationsBySender(
    { senderId, type, startDate, endDate }: GetNotificationBySenderRequest
  ): Promise<GetNotificationModel[]>;
  createNotification(
    { title, description, senderId, receiverId, type, userCapabilityDayId, userCapabilityTimeId, userCapabilityCourseId, userDayoffId }: PostNotificationRequest
  ): Promise<void>;
  updateNotification({ notificationId, isApproved }: { notificationId: string, isApproved: boolean }): Promise<void>;
}
