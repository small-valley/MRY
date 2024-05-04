export interface GetCohortsForFilterResponse {
  programId: string;
  programName: string;
  cohorts: Cohort[];
}

interface Cohort {
  cohortId: string;
  cohortName: string;
}
