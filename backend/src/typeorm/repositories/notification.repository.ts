import { InjectRepository } from "@nestjs/typeorm";
import {
  GetNotificationModel,
} from "src/repository/models/notification.model";
import { INotificationRepository } from "src/repository/interfaces/INotificationRepository";
import { Repository } from "typeorm";
import { Notification } from "../entities/notification.entity";
import { User } from "../entities/user.entity";
import { PostNotificationRequest } from "../../../../shared/models/requests/postNotificationRequest";
import { PostNotificationResponse } from "../../../../shared/models/responses/postNotificationResponse";
import { UserCapabilityDay } from "../entities/user_capability_day.entity";
import { UserCapabilityTime } from "../entities/user_capability_time.entity";
import { UserCapabilityCourse } from "../entities/user_capability_course.entity";
import { UserDayoff } from "../entities/user_dayoff.entity";
import { Course } from "../entities/course.entity";
import { Time } from "../entities/time.entity";
import { Day } from "../entities/day.entity";

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
        "notification.forDelete",
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
      .leftJoinAndMapOne("notification.userCapabilityDay", UserCapabilityDay, "userCapabilityDay", "notification.userCapabilityDayId = userCapabilityDay.id")
      .leftJoinAndMapOne("notification.userCapabilityTime", UserCapabilityTime, "userCapabilityTime", "notification.userCapabilityTimeId = userCapabilityTime.id")
      .leftJoinAndMapOne("notification.userCapabilityCourse", UserCapabilityCourse, "userCapabilityCourse", "notification.userCapabilityCourseId = userCapabilityCourse.id")
      .leftJoinAndMapOne("notification.userDayoff", UserDayoff, "userDayoff", "notification.userDayoffId = userDayoff.id")
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
        "userCapabilityDay.id",
        "userCapabilityDay.dayId",
        "userCapabilityTime.id",
        "userCapabilityTime.timeId",
        "userCapabilityCourse.id",
        "userCapabilityCourse.courseId",
        "userDayoff.id",
        "userDayoff.startDate",
        "userDayoff.endDate",
      ])
      .orderBy("notification.createdAt", "DESC")
      .getMany();
  }

  async createNotification(
    { title, description, senderId, receiverId, type, userCapabilityDayId, userCapabilityTimeId, userCapabilityCourseId, userDayoffId, forDelete = false }: PostNotificationRequest
  ): Promise<PostNotificationResponse> {
    const notification = new Notification();
    switch (type) {
      case "message":
        notification.linkUrl = "";
        notification.description = description;
        break;
      case "vacation":
        notification.linkUrl = "/instructors";
        notification.userDayoffId = userDayoffId;
        break;
      case "day":
        notification.linkUrl = "/instructors";
        notification.userCapabilityDayId = userCapabilityDayId;
        break;
      case "time":
        notification.linkUrl = "/instructors";
        notification.userCapabilityTimeId = userCapabilityTimeId;
        break;
      case "course":
        notification.linkUrl = "/instructors";
        notification.userCapabilityCourseId = userCapabilityCourseId;
        break;
      default:
        break;
    }
    notification.title = title;
    notification.senderId = senderId;
    notification.receiverId = receiverId;
    notification.type = type;
    notification.isRead = false;
    notification.forDelete = forDelete;
    const createdNotification = await this.notificationRepository.save(notification);
    switch (type) {
      case "vacation":
        const notificationWithUserDayoff = await this.notificationRepository.createQueryBuilder("notification")
          .leftJoinAndMapOne("notification.userDayoff", UserDayoff, "userDayoff", "notification.userDayoffId = userDayoff.id")
          .where("notification.id = :id", { id: createdNotification.id })
          .select([
            "notification.id",
            "userDayoff.id",
            "userDayoff.startDate",
            "userDayoff.endDate",
          ])
          .getOne();
        const userDayoff = notificationWithUserDayoff.userDayoff;
        const startDate = userDayoff.startDate;
        const endDate = userDayoff.endDate;
        notification.description = String(forDelete) === 'true' ? `Delete vacation ${startDate} - ${endDate}` : `Add vacation ${startDate} - ${endDate}`
        break;
      case "day":
        const notificationWithUserCapabilityDay = await this.notificationRepository.createQueryBuilder("notification")
          .leftJoinAndMapOne("notification.userCapabilityDay", UserCapabilityDay, "userCapabilityDay", "notification.userCapabilityDayId = userCapabilityDay.id")
          .leftJoinAndMapOne("userCapabilityDay.day", Day, "day", "userCapabilityDay.dayId = day.id")
          .where("notification.id = :id", { id: createdNotification.id })
          .select([
            "notification.id",
            "userCapabilityDay.id",
            "userCapabilityDay.dayId",
            "day.name",
          ])
          .getOne();
        const userCapabilityDay = notificationWithUserCapabilityDay.userCapabilityDay;
        const dayName = userCapabilityDay.day.name;
        notification.description = String(forDelete) === 'true' ? `Delete available day "${dayName}"` : `Add available day "${dayName}"`
        break;
      case "time":
        const notificationWithUserCapabilityTime = await this.notificationRepository.createQueryBuilder("notification")
          .leftJoinAndMapOne("notification.userCapabilityTime", UserCapabilityTime, "userCapabilityTime", "notification.userCapabilityTimeId = userCapabilityTime.id")
          .leftJoinAndMapOne("userCapabilityTime.time", Time, "time", "userCapabilityTime.timeId = time.id")
          .where("notification.id = :id", { id: createdNotification.id })
          .select([
            "notification.id",
            "userCapabilityTime.id",
            "userCapabilityTime.timeId",
            "time.name",
          ])
          .getOne();
        const userCapabilityTime = notificationWithUserCapabilityTime.userCapabilityTime;
        const timeName = userCapabilityTime.time.name;
        notification.description = String(forDelete) === 'true' ? `Delete available time "${timeName}"` : `Add available time "${timeName}"`
        break;
      case "course":
        const notificationWithUserCapabilityCourse = await this.notificationRepository.createQueryBuilder("notification")
          .leftJoinAndMapOne("notification.userCapabilityCourse", UserCapabilityCourse, "userCapabilityCourse", "notification.userCapabilityCourseId = userCapabilityCourse.id")
          .leftJoinAndMapOne("userCapabilityCourse.course", Course, "course", "userCapabilityCourse.courseId = course.id")
          .where("notification.id = :id", { id: createdNotification.id })
          .select([
            "notification.id",
            "userCapabilityCourse.id",
            "userCapabilityCourse.courseId",
            "course.name",
          ])
          .getOne();
        const userCapabilityCourse = notificationWithUserCapabilityCourse.userCapabilityCourse;
        const courseName = userCapabilityCourse.course.name;
        notification.description = String(forDelete) === 'true' ? `Delete available course "${courseName}"` : `Add available course "${courseName}"`
        break;
      default:
        break;
    }
    await this.notificationRepository.save(notification);
    return { notificationId: createdNotification.id };
  }

  async updateNotification({ notificationId, isApproved }: { notificationId: string, isApproved: boolean }): Promise<void> {
    const updatedNotification = await this.notificationRepository.createQueryBuilder("notification")
      .where("notification.id = :id", { id: notificationId })
      .getOne();
    updatedNotification.isRead = true;
    updatedNotification.isApproved = isApproved && String(isApproved) === 'true' ? true : false;
    await this.notificationRepository.save(updatedNotification);
  }
}
