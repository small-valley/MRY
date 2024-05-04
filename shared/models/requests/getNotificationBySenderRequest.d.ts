export interface GetNotificationBySenderRequest {
    senderId: string;
    type?: string;
    startDate?: Date;
    endDate?: Date;
}
