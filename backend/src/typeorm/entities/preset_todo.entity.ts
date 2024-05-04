import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseColumns } from "./base/base-columns";

@Entity({ name: "preset_todos" })
export class PresetTodo extends BaseColumns {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column()
  description: string;
}
