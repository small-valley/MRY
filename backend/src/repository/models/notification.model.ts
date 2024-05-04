export interface GetNotificationModel {
  id: string;
  title: string;
  description: string;
  linkUrl: string;
  isRead: boolean;
  type: string;
  sender: Sender;
  createdAt: Date;
}

interface Sender {
  id: string;
  firstName: string;
}