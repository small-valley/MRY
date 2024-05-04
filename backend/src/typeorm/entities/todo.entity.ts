import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BaseColumns } from "./base/base-columns";
import { Schedule } from "./schedule.entity";

@Entity({ name: "todos" })
export class Todo extends BaseColumns {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "schedule_id" })
  scheduleId: string;

  @Column({ length: 255 })
  title: string;

  @Column()
  description: string;

  @Column({ type: "date", name: "due_date" })
  dueDate: Date;

  @Column({ name: "is_completed", default: false })
  isCompleted: boolean;

  @ManyToOne(() => Schedule, (schedule) => schedule.todos, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn({ name: "schedule_id", referencedColumnName: "id" })
  schedule: Schedule;
}
