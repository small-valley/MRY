import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BaseColumns } from "./base/base-columns";
import { User } from "./user.entity";
import { UserDayoff } from "./user_dayoff.entity";
import { UserCapabilityCourse } from "./user_capability_course.entity";
import { UserCapabilityDay } from "./user_capability_day.entity";
import { UserCapabilityTime } from "./user_capability_time.entity";

export enum NotificationType {
  VACATION = "vacation",
  DAY = "day",
  TIME = "time",
  COURSE = "course",
  MESSAGE = "message",
}
@Entity({ name: "notifications" })
export class Notification extends BaseColumns {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "sender_id" })
  senderId: string;

  @Column({ name: "receiver_id" })
  receiverId: string;

  @Column({ name: "user_dayoff_id", nullable: true })
  userDayoffId: string;

  @Column({ name: "user_capability_course_id", nullable: true })
  userCapabilityCourseId: string;

  @Column({ name: "user_capability_day_id", nullable: true })
  userCapabilityDayId: string;

  @Column({ name: "user_capability_time_id", nullable: true })
  userCapabilityTimeId: string;

  @Column({ length: 255 })
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ name: "link_url", length: 255 })
  linkUrl: string;

  @Column({ name: "is_read", default: false })
  isRead: boolean;

  @Column({ name: "for_delete", default: false })
  forDelete: boolean;

  @Column({ name: "is_approved", default: false })
  isApproved: boolean;

  @Column({
    type: "enum",
    enum: NotificationType,
  })
  type: NotificationType;

  @ManyToOne(() => User, (user) => user.notifications, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn({ name: "sender_id", referencedColumnName: "id" })
  sender: User;

  @ManyToOne(() => User, (user) => user.notifications, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn({ name: "receiver_id", referencedColumnName: "id" })
  receiver: User;

  @ManyToOne(() => UserDayoff, (userDayoff) => userDayoff.notifications, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn({ name: "user_dayoff_id", referencedColumnName: "id" })
  userDayoff: UserDayoff;

  @ManyToOne(() => UserCapabilityCourse, (userCapabilityCourse) => userCapabilityCourse.notifications, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn({ name: "user_capability_course_id", referencedColumnName: "id" })
  userCapabilityCourse: UserCapabilityCourse;

  @ManyToOne(() => UserCapabilityDay, (userCapabilityDay) => userCapabilityDay.notifications, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn({ name: "user_capability_day_id", referencedColumnName: "id" })
  userCapabilityDay: UserCapabilityDay;

  @ManyToOne(() => UserCapabilityTime, (userCapabilityTime) => userCapabilityTime.notifications, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn({ name: "user_capability_time_id", referencedColumnName: "id" })
  userCapabilityTime: UserCapabilityTime;
}
