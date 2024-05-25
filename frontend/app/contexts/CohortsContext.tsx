import React, { createContext, useCallback, useEffect, useState } from 'react';
import { GetCohortsResponse } from '../../../shared/models/responses/getCohortsResponse';
import { GetCohortsRequest } from '../../../shared/models/requests/getCohortsRequest';
import { getApiData } from '../actions/common';

interface CohortsContext {
  cohorts: GetCohortsResponse[];
  setCohorts: (cohorts: GetCohortsResponse[]) => void;
  getCohorts: (requests?: GetCohortsRequest) => Promise<void>;
}

const initialState: CohortsContext = {
  cohorts: [],
  setCohorts: () => {},
  getCohorts: () => Promise.resolve(),
};

export const CohortsContext = createContext<CohortsContext>(initialState);

export const CohortsProvider = ({ children }: { children: React.ReactNode }) => {
  const [cohorts, setCohorts] = useState<GetCohortsResponse[]>([]);

  const getCohorts = useCallback(async ({ startDate, endDate }: GetCohortsRequest = {}) => {
    const data = await getApiData<GetCohortsResponse[]>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL_A}/cohorts${startDate ? `?startDate=${startDate}` : ''}${
        endDate ? `&endDate=${endDate}` : ''
      }`
    );
    if (!(data instanceof Error) && data) {
      setCohorts(data);
    }
  }, []);

  useEffect(() => {
    getCohorts();
  }, []);

  return <CohortsContext.Provider value={{ cohorts, setCohorts, getCohorts }}>{children}</CohortsContext.Provider>;
};
