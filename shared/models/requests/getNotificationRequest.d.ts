export interface GetNotificationRequest {
    receiverId: string;
    type?: string;
    startDate?: Date;
    endDate?: Date;
}
