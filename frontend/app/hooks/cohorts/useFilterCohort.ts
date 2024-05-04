import { changeDate, getApiData } from '@/app/actions/common';
import { useCallback, useEffect, useState } from 'react';
import { GetCohortsForFilterResponse } from '../../../../shared/models/responses/getCohortsForFilterResponse';

const useCohortFilter = (startDate?: Date, endDate?: Date) => {
  const [cohortFilter, setCohortFilter] = useState<GetCohortsForFilterResponse[]>();

  const fetchCohortFilter = useCallback(async () => {
    if (startDate && endDate) {
      const queryParameter = `startDate=${changeDate(startDate)}&endDate=${changeDate(endDate)}`;
      const cohortFilterData = await getApiData<GetCohortsForFilterResponse[]>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL_A}/cohorts/filter?${queryParameter}`
      );
      if (!(cohortFilterData instanceof Error) && cohortFilterData) {
        setCohortFilter(cohortFilterData);
      }
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchCohortFilter();
  }, [startDate, endDate]);

  return { cohortFilter, fetchCohortFilter };
};

export default useCohortFilter;
