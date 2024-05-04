import { Inject, Injectable } from "@nestjs/common";
import { DataSource, QueryRunner } from "typeorm";
import { IRepositoryService } from "../../repository/interfaces/IRepositoryService";

@Injectable()
export class RepositoryService implements IRepositoryService {
  @Inject(DataSource)
  private readonly dataSource: DataSource;

  async beginTransaction() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    return queryRunner;
  }

  async commitTransaction(queryRunner: QueryRunner) {
    await queryRunner.commitTransaction();
  }

  async rollbackTransaction(queryRunner: QueryRunner) {
    await queryRunner.rollbackTransaction();
  }

  async release(queryRunner: QueryRunner) {
    await queryRunner.release();
  }
}
