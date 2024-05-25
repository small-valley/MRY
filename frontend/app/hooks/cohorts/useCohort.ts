import { useCallback, useEffect, useState } from 'react';
import { GetCohortResponse } from '../../../../shared/models/responses/getCohortResponse';
import { getCohortById } from '../../actions/cohorts';

const useCohort = (cohortId: string, programId: string) => {
  const [cohort, setCohort] = useState<GetCohortResponse | null>(null);

  const fetchCohort = useCallback(async () => {
    const cohortData = await getCohortById(cohortId);
    setCohort(cohortData);
  }, [cohortId, programId]);

  useEffect(() => {
    fetchCohort();
  }, [cohortId, programId]);

  return { cohort, fetchCohort };
};

export default useCohort;
