import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BaseColumns } from "./base/base-columns";
import { Program } from "./program.entity";
import { Schedule } from "./schedule.entity";
import { UserCapabilityCourse } from "./user_capability_course.entity";

export enum Colors {
  ORANGE = "orange",
  PINK = "pink",
  BLUE = "blue",
  GRAY = "gray",
  PURPLE = "purple",
  GREEN = "green",
}

@Entity({ name: "courses" })
export class Course extends BaseColumns {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ name: "program_id" })
  programId: string;

  @Column({
    type: "enum",
    enum: Colors,
  })
  color: Colors;

  @Column()
  hour: number;

  @ManyToOne(() => Program, (program) => program.courses, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn({ name: "program_id", referencedColumnName: "id" })
  program: Program;

  @OneToMany(() => Schedule, (schedule) => schedule.course)
  schedules: Schedule[];

  @OneToMany(
    () => UserCapabilityCourse,
    (userCapabilityCourse) => userCapabilityCourse.course
  )
  userCapabilityCourses: UserCapabilityCourse[];
}
