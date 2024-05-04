import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BaseColumns } from "./base/base-columns";
import { User } from "./user.entity";
import { Notification } from "./notification.entity";

@Entity({ name: "user_dayoffs" })
export class UserDayoff extends BaseColumns {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "user_id" })
  userId: string;

  @Column({ type: "date", name: "start_date" })
  startDate: Date;

  @Column({ type: "date", name: "end_date" })
  endDate: Date;

  @Column({ name: "is_draft", default: false })
  isDraft: boolean;

  @ManyToOne(() => User, (user) => user.userDayoffs, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user: User;

  @OneToMany(() => Notification, (notification) => notification.userDayoff)
  notifications: Notification[];
}
