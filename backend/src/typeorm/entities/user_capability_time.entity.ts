import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BaseColumns } from "./base/base-columns";
import { Time } from "./time.entity";
import { User } from "./user.entity";
import { Notification } from "./notification.entity";

@Entity({ name: "user_capability_times" })
export class UserCapabilityTime extends BaseColumns {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "user_id" })
  userId: string;

  @Column({ name: "time_id" })
  timeId: string;

  @Column({ name: "is_draft", default: false })
  isDraft: boolean;

  @ManyToOne(() => User, (user) => user.userCapabilityTimes, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user: User;

  @ManyToOne(() => Time, (time) => time.userCapabilityTimes, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn({ name: "time_id", referencedColumnName: "id" })
  time: Time;

  @OneToMany(() => Notification, (notification) => notification.userCapabilityTime)
  notifications: Notification[];
}
