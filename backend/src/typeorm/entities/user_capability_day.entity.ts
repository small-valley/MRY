import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BaseColumns } from "./base/base-columns";
import { Day } from "./day.entity";
import { User } from "./user.entity";
import { Notification } from "./notification.entity";

@Entity({ name: "user_capability_days" })
export class UserCapabilityDay extends BaseColumns {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "user_id" })
  userId: string;

  @Column({ name: "day_id" })
  dayId: string;

  @Column({ name: "is_draft", default: false })
  isDraft: boolean;

  @ManyToOne(() => User, (user) => user.userCapabilityDays, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user: User;

  @ManyToOne(() => Day, (day) => day.userCapabilityDays, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn({ name: "day_id", referencedColumnName: "id" })
  day: Day;

  @OneToMany(() => Notification, (notification) => notification.userCapabilityDay)
  notifications: Notification[];
}
