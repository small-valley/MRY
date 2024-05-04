import { useState, useEffect, useCallback } from 'react';
import { GetAvailabilityResponse } from '../../../../shared/models/responses/getAvailabilityResponse';
import { getAvailabilityBySchedule } from '../../actions/cohorts';

const useAvailability = (scheduleId: string) => {
  const [availability, setAvailability] = useState<GetAvailabilityResponse>();

  const fetchAvailability = useCallback(async () => {
    const availabilityData = await getAvailabilityBySchedule(scheduleId);
    setAvailability(availabilityData);
  }, [scheduleId]);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability, scheduleId]);

  return { availability, fetchAvailability };
};

export default useAvailability;
