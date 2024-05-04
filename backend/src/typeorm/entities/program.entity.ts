import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BaseColumns } from "./base/base-columns";
import { Cohort } from "./cohort.entity";
import { Course } from "./course.entity";
import { ProgramUser } from "./program_user.entity";

@Entity({ name: "programs" })
export class Program extends BaseColumns {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 255 })
  name: string;

  @OneToMany(() => Course, (course) => course.program, { cascade: ["insert"] })
  courses: Course[];

  @OneToMany(() => Cohort, (cohort) => cohort.program)
  cohorts: Cohort[];

  @OneToMany(() => ProgramUser, (programUser) => programUser.program)
  programUsers: ProgramUser[];
}
