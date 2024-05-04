import { useState, useEffect, useCallback } from 'react';
import { GetProgramResponse } from '../../../../shared/models/responses/getProgramResponse';
import { getPrograms } from '@/app/actions/programs';

const usePrograms = () => {
  const [programs, setPrograms] = useState<GetProgramResponse[]>();

  const fetchPrograms = useCallback(async () => {
    const programsData = await getPrograms();
    setPrograms(programsData);
  }, []);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  return { programs, fetchPrograms };
};

export default usePrograms;
