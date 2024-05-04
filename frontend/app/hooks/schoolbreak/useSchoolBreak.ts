import { useState, useEffect, useCallback } from 'react';
import { GetSchoolBreaksResponse } from '../../../../shared/models/responses/getSchoolBreaksResponse';
import { getSchoolBreak } from '@/app/actions/schoolbreak';

const useSchoolBreak = () => {
  const [breaks, setBreaks] = useState<GetSchoolBreaksResponse[]>();

  const fetchBreaks = useCallback(async () => {
    const tmpbreak = await getSchoolBreak();
    setBreaks(tmpbreak);
  }, []);

  useEffect(() => {
    fetchBreaks();
  }, [fetchBreaks]);

  return { breaks, fetchBreaks };
};

export default useSchoolBreak;
