import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BaseColumns } from "./base/base-columns";
import { Cohort } from "./cohort.entity";
import { UserCapabilityTime } from "./user_capability_time.entity";

@Entity({ name: "times" })
export class Time extends BaseColumns {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 15 })
  name: string;

  @Column({ type: "time", name: "start_time" })
  startTime: string;

  @Column({ type: "time", name: "end_time" })
  endTime: string;

  @OneToMany(() => Cohort, (cohort) => cohort.time)
  cohorts: Cohort[];

  @OneToMany(
    () => UserCapabilityTime,
    (userCapabilityTime) => userCapabilityTime.time
  )
  userCapabilityTimes: UserCapabilityTime[];
}
