export interface GetNotificationResponse {
  id: string;
  title: string;
  description: string;
  linkUrl: string;
  isRead: boolean;
  type: string;
  sender: Sender;
  createdAt: Date;
  userCapabilityDayId?: string;
  userCapabilityTimeId?: string;
  userCapabilityCourseId?: string;
  userDayoffId?: string;
  isApproved?: boolean;
}

interface Sender {
  id: string;
  firstName: string;
}
