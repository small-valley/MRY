import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BaseColumns } from "./base/base-columns";
import { Program } from "./program.entity";
import { User } from "./user.entity";

@Entity({ name: "program_users" })
export class ProgramUser extends BaseColumns {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "program_id" })
  programId: string;

  @Column({ name: "user_id" })
  userId: string;

  @ManyToOne(() => Program, (program) => program.programUsers, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn({ name: "program_id", referencedColumnName: "id" })
  program: Program;

  @ManyToOne(() => User, (user) => user.userCapabilityCourses, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user: User;
}
