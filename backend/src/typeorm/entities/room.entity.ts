import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BaseColumns } from "./base/base-columns";
import { Schedule } from "./schedule.entity";

@Entity({ name: "rooms" })
export class Room extends BaseColumns {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column()
  floor: number;

  @Column()
  capacity: number;

  @OneToMany(() => Schedule, (schedule) => schedule.room)
  schedules: Schedule[];
}
