import { Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

export class BaseColumns {
  @Column({ name: "created_by", length: 128, default: null })
  createdBy: string;

  @Column({ name: "updated_by", length: 128, default: null })
  updatedBy: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @Column({ name: "is_deleted", default: false })
  isDeleted: boolean;
}
