import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BaseColumns } from "./base/base-columns";
import { Program } from "./program.entity";
import { Schedule } from "./schedule.entity";
import { Time } from "./time.entity";

@Entity({ name: "cohorts" })
export class Cohort extends BaseColumns {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ name: "program_id" })
  programId: string;

  @Column({ name: "time_id" })
  timeId: string;

  @Column({ length: 255 })
  intake: string;

  @Column({ name: "student_count" })
  studentCount: number;

  @OneToMany(() => Schedule, (schedule) => schedule.cohort)
  schedules: Schedule[];

  @ManyToOne(() => Program, (program) => program.cohorts, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn({ name: "program_id", referencedColumnName: "id" })
  program: Program;

  @ManyToOne(() => Time, (time) => time.cohorts, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn({ name: "time_id", referencedColumnName: "id" })
  time: Time;
}
