import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BaseColumns } from "./base/base-columns";
import { OverlappableDay } from "./overlappable_day.entity";
import { Schedule } from "./schedule.entity";
import { UserCapabilityDay } from "./user_capability_day.entity";

export enum DayOfWeek {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
}

@Entity({ name: "days" })
export class Day extends BaseColumns {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 20 })
  name: string;

  @Column({ name: "hours_per_week" })
  hoursPerWeek: number;

  @Column({ type: "enum", enum: DayOfWeek, name: "start_day_of_week" })
  startDayOfWeek: DayOfWeek;

  @Column({ type: "enum", enum: DayOfWeek, name: "end_day_of_week" })
  endDayOfWeek: DayOfWeek;

  @OneToMany(() => Schedule, (schedule) => schedule.day)
  schedules: Schedule[];

  @OneToMany(() => UserCapabilityDay, (userCapabilityDays) => userCapabilityDays.day)
  userCapabilityDays: UserCapabilityDay[];

  @OneToMany(() => OverlappableDay, (overlappableDay) => overlappableDay.day)
  days: OverlappableDay[];

  @OneToMany(() => OverlappableDay, (overlappableDay) => overlappableDay.overlappableDay)
  overlappableDays: OverlappableDay[];
}
