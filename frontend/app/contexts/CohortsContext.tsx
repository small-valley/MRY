import React, { createContext, useCallback, useEffect, useState } from "react";
import { GetCohortsResponse } from "../../../shared/models/responses/getCohortsResponse";

interface CohortsContext {
  cohorts: GetCohortsResponse[];
  setCohorts: (cohorts: GetCohortsResponse[]) => void;
  getCohorts: () => void;
}

const initialState: CohortsContext = {
  cohorts: [],
  setCohorts: () => {},
  getCohorts: () => {},
};

export const CohortsContext = createContext<CohortsContext>(initialState);

export const CohortsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/cohorts`;
  const [cohorts, setCohorts] = useState<GetCohortsResponse[]>([]);

  const getCohorts = useCallback(async () => {
    const response = await fetch(baseUrl);
    const data = await response.json();
    setCohorts(data.data);
  }, []);

  useEffect(() => {
    getCohorts();
  }, []);

  return (
    <CohortsContext.Provider value={{ cohorts, setCohorts, getCohorts }}>
      {children}
    </CohortsContext.Provider>
  );
};
