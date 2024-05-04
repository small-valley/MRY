import { Inject, Injectable } from "@nestjs/common";
import { GetNotificationResponse } from "../../../../shared/models/responses/getNotificationResponse";
import { GetNotificationRequest } from "../../../../shared/models/requests/getNotificationRequest";
import { PostNotificationRequest } from "../../../../shared/models/requests/postNotificationRequest";
import { INotificationRepository } from "src/repository/interfaces/INotificationRepository";
import { GetNotificationBySenderRequest } from "../../../../shared/models/requests/getNotificationBySenderRequest";

@Injectable()
export class NotificationService {
  @Inject("notificationRepository")
  private readonly notificationRepository: INotificationRepository;

  async getNotifications({ receiverId, type, startDate, endDate }: GetNotificationRequest): Promise<GetNotificationResponse[]> {
    const response = await this.notificationRepository.getNotifications({ receiverId, type, startDate, endDate });
    return response;
  }

  async getNotificationsBySender({ senderId, type, startDate, endDate }: GetNotificationBySenderRequest): Promise<GetNotificationResponse[]> {
    const response = await this.notificationRepository.getNotificationsBySender({ senderId, type, startDate, endDate });
    return response;
  }

  async createNotification({ title, description, senderId, receiverId, type }: PostNotificationRequest): Promise<void> {
    await this.notificationRepository.createNotification({ title, description, senderId, receiverId, type });
  }

  async updateNotification({ notificationId, isApproved }: { notificationId: string, isApproved: boolean }): Promise<void> {
    await this.notificationRepository.updateNotification({ notificationId, isApproved });
  }
}
