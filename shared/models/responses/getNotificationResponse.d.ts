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
  forDelete?: boolean;
  userCapabilityDay?: userCapabilityDay;
  userCapabilityTime?: userCapabilityTime;
  userCapabilityCourse?: userCapabilityCourse;
}

interface Sender {
  id: string;
  firstName: string;
}

interface userCapabilityDay {
  id: string;
  dayId: string;
}

interface userCapabilityTime {
  id: string;
  timeId: string;
}

interface userCapabilityCourse {
  id: string;
  courseId: string;
}
