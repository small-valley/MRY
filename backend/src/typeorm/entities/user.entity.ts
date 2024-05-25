import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BaseColumns } from "./base/base-columns";
import { ContractType } from "./contract_type.entity";
import { Notification } from "./notification.entity";
import { Schedule } from "./schedule.entity";
import { UserCapabilityCourse } from "./user_capability_course.entity";
import { UserCapabilityDay } from "./user_capability_day.entity";
import { UserCapabilityTime } from "./user_capability_time.entity";
import { UserDayoff } from "./user_dayoff.entity";

export enum Role {
  MANAGER = "manager",
  INSTRUCTOR = "instructor",
}

@Entity({ name: "users" })
export class User extends BaseColumns {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "first_name", length: 255 })
  firstName: string;

  @Column({ name: "last_name", length: 255 })
  lastName: string;

  @Column({
    type: "enum",
    enum: Role,
    default: Role.INSTRUCTOR,
  })
  role: Role;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ length: 255, nullable: true })
  password: string;

  @Column({ name: "avatar_url", length: 510, nullable: true })
  avatarUrl: string;

  @Column({ name: "contract_type_id", nullable: true })
  contractTypeId: string;

  @Column({ name: "is_active", default: true })
  isActive: boolean;

  @Column({ name: "access_token", nullable: true })
  accessToken: string;

  @OneToMany(() => User, (user) => user.schedules)
  schedules: Schedule[];

  @OneToMany(() => UserCapabilityTime, (userCapabilityTime) => userCapabilityTime.user)
  userCapabilityTimes: UserCapabilityTime[];

  @OneToMany(() => UserCapabilityDay, (userCapabilityDay) => userCapabilityDay.user)
  userCapabilityDays: UserCapabilityDay[];

  @OneToMany(() => UserCapabilityCourse, (userCapabilityCourse) => userCapabilityCourse.user)
  userCapabilityCourses: UserCapabilityCourse[];

  @OneToMany(() => UserDayoff, (userDayoff) => userDayoff.user)
  userDayoffs: UserDayoff[];

  @OneToMany(() => Notification, (notification) => notification.sender)
  notifications: Notification[];

  @OneToMany(() => Notification, (notification) => notification.receiver)
  receivedNotifications: Notification[];

  @ManyToOne(() => ContractType, (contract) => contract.users, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn({ name: "contract_type_id", referencedColumnName: "id" })
  contract: ContractType;
}
