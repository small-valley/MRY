import { InjectRepository } from "@nestjs/typeorm";
import {
  GetNotificationModel,
} from "src/repository/models/notification.model";
import { INotificationRepository } from "src/repository/interfaces/INotificationRepository";
import { Repository } from "typeorm";
import { Notification } from "../entities/notification.entity";
import { User } from "../entities/user.entity";
import { PostNotificationRequest } from "../../../../shared/models/requests/postNotificationRequest";

export class NotificationRepository implements INotificationRepository {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) { }

  async getNotifications(
    { receiverId, type, startDate, endDate }: { receiverId: string; type?: string; startDate?: Date; endDate?: Date }
  ): Promise<GetNotificationModel[]> {
    return await this.notificationRepository.createQueryBuilder("notification")
      .leftJoinAndMapOne("notification.sender", User, "sender", "notification.senderId = sender.id")
      .where("notification.receiverId = :receiverId", { receiverId })
      .andWhere(type ? "notification.type = :type" : "1=1", { type })
      .andWhere(startDate ? "notification.createdAt >= :startDate" : "1=1", { startDate })
      .andWhere(endDate ? "notification.createdAt <= :endDate" : "1=1", { endDate })
      .andWhere("notification.isDeleted = :isDeleted", { isDeleted: false })
      .select([
        "notification.id",
        "notification.title",
        "notification.description",
        "notification.type",
        "notification.isRead",
        "notification.linkUrl",
        "notification.createdAt",
        "notification.userCapabilityDayId",
        "notification.userCapabilityTimeId",
        "notification.userCapabilityCourseId",
        "notification.userDayoffId",
        "notification.isApproved",
        "sender.id",
        "sender.firstName",
      ])
      .orderBy("notification.createdAt", "DESC")
      .getMany();
  }

  async getNotificationsBySender(
    { senderId, type, startDate, endDate }: { senderId: string; type?: string; startDate?: Date; endDate?: Date }
  ): Promise<GetNotificationModel[]> {
    return await this.notificationRepository.createQueryBuilder("notification")
      .leftJoinAndMapOne("notification.receiver", User, "receiver", "notification.receiverId = receiver.id")
      .where("notification.senderId = :senderId", { senderId })
      .andWhere(type ? "notification.type = :type" : "1=1", { type })
      .andWhere(startDate ? "notification.createdAt >= :startDate" : "1=1", { startDate })
      .andWhere(endDate ? "notification.createdAt <= :endDate" : "1=1", { endDate })
      .andWhere("notification.isDeleted = :isDeleted", { isDeleted: false })
      .select([
        "notification.id",
        "notification.title",
        "notification.description",
        "notification.type",
        "notification.isRead",
        "notification.linkUrl",
        "notification.createdAt",
        "notification.userCapabilityDayId",
        "notification.userCapabilityTimeId",
        "notification.userCapabilityCourseId",
        "notification.userDayoffId",
        "notification.isApproved",
        "receiver.id",
        "receiver.firstName",
      ])
      .orderBy("notification.createdAt", "DESC")
      .getMany();
  }

  async createNotification(
    { title, description, senderId, receiverId, type, userCapabilityDayId, userCapabilityTimeId, userCapabilityCourseId, userDayoffId, forDelete = false }: PostNotificationRequest
  ): Promise<void> {
    const notification = new Notification();
    switch (type) {
      case "message":
        notification.linkUrl = "";
        notification.description = description;
        break;
      case "vacation":
        notification.linkUrl = "/instructors";
        notification.userDayoffId = userDayoffId;
        const startDate = notification.userDayoff.startDate;
        const endDate = notification.userDayoff.endDate;
        notification.description = forDelete ? `Delete vacation ${startDate} - ${endDate}` : `Add vacation ${startDate} - ${endDate}`
        break;
      case "day":
        notification.linkUrl = "/instructors";
        notification.userCapabilityDayId = userCapabilityDayId;
        notification.description = forDelete ? "Delete available day" : "Add available day"
        break;
      case "time":
        notification.linkUrl = "/instructors";
        notification.userCapabilityTimeId = userCapabilityTimeId;
        notification.description = forDelete ? "Delete available time" : "Add available time"
        break;
      case "course":
        notification.linkUrl = "/instructors";
        notification.userCapabilityCourseId = userCapabilityCourseId;
        notification.description = forDelete ? "Delete available course" : "Add available course"
        break;
      default:
        break;
    }
    notification.title = title;
    notification.senderId = senderId;
    notification.receiverId = receiverId;
    notification.type = type;
    notification.isRead = false;
    await this.notificationRepository.save(notification);
  }

  async updateNotification({ notificationId, isApproved }: { notificationId: string, isApproved: boolean }): Promise<void> {
    const updatedNotification = await this.notificationRepository.createQueryBuilder("notification")
      .where("notification.id = :id", { id: notificationId })
      .getOne();
    updatedNotification.isRead = true;
    console.log(isApproved)
    updatedNotification.isApproved = isApproved ? true : false;
    await this.notificationRepository.save(updatedNotification);
  }
}
