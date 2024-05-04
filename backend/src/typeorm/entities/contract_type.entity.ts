import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BaseColumns } from "./base/base-columns";
import { User } from "./user.entity";

export enum HourType {
  FULL = "full",
  PART = "part",
  CONTRACT = "contract",
}

@Entity({ name: "contract_types" })
export class ContractType extends BaseColumns {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "enum",
    enum: HourType,
  })
  name: HourType;

  @Column({ name: "min_hours_per_week", nullable: true })
  minHoursPerWeek: number;

  @Column({ name: "max_hours_per_week", nullable: true })
  maxHoursPerWeek: number;

  @OneToMany(() => User, (user) => user.contract)
  users: User[];
}
