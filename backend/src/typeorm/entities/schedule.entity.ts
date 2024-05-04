import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BaseColumns } from "./base/base-columns";
import { Cohort } from "./cohort.entity";
import { Course } from "./course.entity";
import { Day } from "./day.entity";
import { Room } from "./room.entity";
import { Todo } from "./todo.entity";
import { User } from "./user.entity";

@Entity({ name: "schedules" })
export class Schedule extends BaseColumns {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "cohort_id" })
  cohortId: string;

  @Column({ name: "course_id", nullable: true })
  courseId: string;

  @Column({ name: "user_id", nullable: true })
  userId: string;

  @Column({ name: "day_id", nullable: true })
  dayId: string;

  @Column({ name: "room_id", nullable: true })
  roomId: string;

  @Column({ type: "date", name: "start_date", nullable: true })
  startDate: Date;

  @Column({ type: "date", name: "end_date", nullable: true })
  endDate: Date;

  @ManyToOne(() => Course, (course) => course.schedules, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn({ name: "course_id", referencedColumnName: "id" })
  course: Course;

  @ManyToOne(() => Cohort, (cohort) => cohort.schedules, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn({ name: "cohort_id", referencedColumnName: "id" })
  cohort: Cohort;

  @ManyToOne(() => User, (user) => user.schedules, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user: User;

  @ManyToOne(() => Day, (day) => day.schedules, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn({ name: "day_id", referencedColumnName: "id" })
  day: Day;

  @ManyToOne(() => Room, (room) => room.schedules, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn({ name: "room_id", referencedColumnName: "id" })
  room: Room;

  @OneToMany(() => Todo, (todo) => todo.schedule)
  todos: Todo[];
}
