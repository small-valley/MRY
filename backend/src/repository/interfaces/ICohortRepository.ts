import { QueryRunner } from "typeorm";
import { GetCohortsRequest } from "../../../../shared/models/requests/getCohortsRequest";
import { GetCohortsResponse } from "../../../../shared/models/responses/getCohortsResponse";
import { GetCohortsForFilterResponse } from "../../../../shared/models/responses/getCohortsForFilterResponse";
import { GetCohortsForFilterRequest } from "../../../../shared/models/requests/getCohortsForFilterRequest";
import { CohortModel, CurrrentCourseHour, InsertCohortModel, RecentCohortModel } from "../models/cohort.model";

export interface ICohortRepository {
  isExistsCohortId(cohortId: string): Promise<boolean>;
  getCohorts({ startDate, endDate }: GetCohortsRequest): Promise<GetCohortsResponse[]>;
  getCohortsForFilter({ startDate, endDate }: GetCohortsForFilterRequest): Promise<GetCohortsForFilterResponse[]>;
  getCohort(cohortId: string): Promise<CohortModel>;
  getRecentCohorts(programId: string): Promise<RecentCohortModel[]>;
  getCurrentCourseHour(cohortId: string, courseId: string, scheduleId: string): Promise<CurrrentCourseHour | undefined>;
  insertCohort(cohort: InsertCohortModel, queryRunner?: QueryRunner): Promise<string>;
}
