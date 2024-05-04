import { useState, useEffect, useCallback } from 'react';
import { getDays } from '@/app/actions/common';
import { GetDaysResponse } from '../../../../shared/models/responses/getDaysResponse';

const useDays = () => {
  const [days, setDays] = useState<GetDaysResponse[]>();

  const fetchDays = useCallback(async () => {
    const daysData = await getDays();
    setDays(daysData);
  }, []);

  useEffect(() => {
    fetchDays();
  }, [fetchDays]);

  return { days, fetchDays };
};

export default useDays;
