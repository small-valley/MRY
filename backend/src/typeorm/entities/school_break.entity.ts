import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseColumns } from "./base/base-columns";

@Entity({ name: "school_breaks" })
export class SchoolBreak extends BaseColumns {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: "date", name: "start_date" })
  startDate: Date;

  @Column({ type: "date", name: "end_date" })
  endDate: Date;
}
