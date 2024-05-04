import { useState, useEffect, useCallback } from "react";
import { GetCohortResponse } from "../../../../shared/models/responses/getCohortResponse";
import { getCohortById } from "../../actions/cohorts";

const useCohort = (cohortId: string) => {
  const [cohort, setCohort] = useState<GetCohortResponse>();

  const fetchCohort = useCallback(async () => {
    const cohortData = await getCohortById(cohortId);
    setCohort(cohortData);
  }, [cohortId]);

  useEffect(() => {
    fetchCohort();
  }, [fetchCohort, cohortId]);

  return { cohort, fetchCohort };
};

export default useCohort;
