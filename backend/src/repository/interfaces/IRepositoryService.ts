import { QueryRunner } from "typeorm";

export interface IRepositoryService {
  beginTransaction(): Promise<QueryRunner | null>;
  commitTransaction(queryRunner: QueryRunner | null): Promise<void>;
  rollbackTransaction(queryRunner: QueryRunner | null): Promise<void>;
  release(queryRunner: QueryRunner | null): Promise<void>;
}
