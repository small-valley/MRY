import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToMany,
} from "typeorm";
import { BaseColumns } from "./base/base-columns";
import { Course } from "./course.entity";
import { User } from "./user.entity";
import { Notification } from "./notification.entity";

@Entity({ name: "user_capability_courses" })
export class UserCapabilityCourse extends BaseColumns {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "user_id" })
  userId: string;

  @Column({ name: "course_id" })
  courseId: string;

  @Column({ name: "is_preference", default: false })
  isPreference: boolean;

  @Column({ name: "is_draft", default: false })
  isDraft: boolean;

  @ManyToOne(() => User, (user) => user.userCapabilityCourses, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user: User;

  @ManyToOne(() => Course, (course) => course.userCapabilityCourses, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn({ name: "course_id", referencedColumnName: "id" })
  course: Course;

  @OneToMany(() => Notification, (notification) => notification.userCapabilityCourse)
  notifications: Notification[];
}
