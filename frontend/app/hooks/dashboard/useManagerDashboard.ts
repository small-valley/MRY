import { useCallback, useEffect, useState } from 'react';
import { GetDashboardResponse } from '../../../../shared/models/responses/getDashboardResponse';
import { getDashboard } from '@/app/actions/dashboard';

const useDashboard = () => {
  const [dashboard, setDashboard] = useState<GetDashboardResponse>();

  const fetchDashboard = useCallback(async () => {
    const dashboardData = await getDashboard();
    setDashboard(dashboardData);
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return { dashboard, fetchDashboard };
};

export default useDashboard;
