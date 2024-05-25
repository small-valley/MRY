import { Body, Controller, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from "@nestjs/swagger";
import { AppController } from "src/app/app.controller";
import { NotificationType } from "src/typeorm/entities/notification.entity";
import { NotificationService } from "./notification.service";

@Controller("notifications")
@ApiTags("notifications")
@ApiBearerAuth("JWT")
export class NotificationController extends AppController {
  constructor(private readonly notificationService: NotificationService) {
    super();
  }

  @Get()
  @ApiQuery({ name: "type", required: false })
  @ApiQuery({ name: "startDate", required: false })
  @ApiQuery({ name: "endDate", required: false })
  async getNotifications(
    @Query("receiverId") receiverId: string,
    @Query("type") type?: string,
    @Query("startDate") startDate?: Date,
    @Query("endDate") endDate?: Date
  ) {
    const result = await this.notificationService.getNotifications({ receiverId, type, startDate, endDate });
    return this.ok(result);
  }

  @Get("/sender")
  @ApiQuery({ name: "type", required: false })
  @ApiQuery({ name: "startDate", required: false })
  @ApiQuery({ name: "endDate", required: false })
  async getNotificationsBySender(
    @Query("senderId") senderId: string,
    @Query("type") type?: string,
    @Query("startDate") startDate?: Date,
    @Query("endDate") endDate?: Date
  ) {
    const result = await this.notificationService.getNotificationsBySender({ senderId, type, startDate, endDate });
    return this.ok(result);
  }

  @Post()
  @ApiQuery({ name: "receiverId", required: false })
  @ApiQuery({ name: "userCapabilityDayId", required: false })
  @ApiQuery({ name: "userCapabilityTimeId", required: false })
  @ApiQuery({ name: "userCapabilityCourseId", required: false })
  @ApiQuery({ name: "userDayoffId", required: false })
  @ApiQuery({ name: "forDelete", required: false })
  @ApiBody({ type: String })
  async createNotification(
    @Body()
    {
      title,
      description,
      receiverId,
      senderId,
      type,
      userCapabilityDayId,
      userCapabilityTimeId,
      userCapabilityCourseId,
      userDayoffId,
      forDelete,
    }: {
      title: string;
      description: string;
      receiverId: string;
      senderId: string;
      type: NotificationType;
      userCapabilityDayId?: string;
      userCapabilityTimeId?: string;
      userCapabilityCourseId?: string;
      userDayoffId?: string;
      forDelete?: boolean;
    }
  ) {
    const response = await this.notificationService.createNotification({
      title,
      description,
      senderId,
      receiverId,
      type,
      userCapabilityDayId,
      userCapabilityTimeId,
      userCapabilityCourseId,
      userDayoffId,
      forDelete,
    });
    return this.ok(response);
  }

  @Put("/:notificationId")
  @ApiQuery({ name: "isApproved", required: false })
  async updateNotification(@Param("notificationId") notificationId: string, @Query("isApproved") isApproved: boolean) {
    await this.notificationService.updateNotification({ notificationId, isApproved });
    return this.ok(null);
  }
}
