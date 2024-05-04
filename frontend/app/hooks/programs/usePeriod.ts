import { useState, useEffect, useCallback } from 'react';
import { getPeriod } from '@/app/actions/common';
import { GetPeriodsResponse } from '../../../../shared/models/responses/getPeriodsResponse';

const usePeriod = () => {
  const [period, setPeriod] = useState<GetPeriodsResponse[]>([]);

  const fetchPeriod = useCallback(async () => {
    const periodData = await getPeriod();
    setPeriod(periodData);
  }, []);

  useEffect(() => {
    fetchPeriod();
  }, [fetchPeriod]);

  return { period, fetchPeriod };
};

export default usePeriod;
