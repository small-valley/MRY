import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { BaseColumns } from "./base/base-columns";
import { Day } from "./day.entity";

@Entity({ name: "overlappable_days" })
export class OverlappableDay extends BaseColumns {
  @PrimaryColumn({ name: "day_id" })
  dayId: string;

  @PrimaryColumn({ name: "overlappable_day_id" })
  overlappableDayId: string;

  @ManyToOne(() => Day, (day) => day.days, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn({ name: "day_id", referencedColumnName: "id" })
  day: Day;

  @ManyToOne(() => Day, (day) => day.overlappableDays, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn({ name: "overlappable_day_id", referencedColumnName: "id" })
  overlappableDay: Day;
}
