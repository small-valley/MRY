'use client';
import Dashboard from '@/components/Dashboard/Dashboard';
import InstructorDashBoard from '@/components/Dashboard/InstructorDashBoard';
import InstructorTodayBar from '@/components/Dashboard/InstructorTodayBar';
import TodayBar from '@/components/Dashboard/TodayBar';
import { useEffect, useState } from 'react';
import { GetLoginUserResponse } from '../../../shared/models/responses/getLoginUserResponse';
import { getApiData } from '../actions/common';
import { useCurrentUserContext } from '../contexts/CurrentUserContext';
import useDashboard from '../hooks/dashboard/useManagerDashboard';
import './home.scss';

const BASE_CLASS = 'home';

export default function Home() {
  const [isManager, setIsManager] = useState<boolean>(false);
  const [isChange, setChange] = useState<number>(0);
  const { dashboard, fetchDashboard } = useDashboard();
  const { currentUser, setCurrentUser } = useCurrentUserContext();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const response = await getApiData<GetLoginUserResponse>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL_A}/users/login/user`
      );
      if (!(response instanceof Error) && response) {
        setCurrentUser(response);
        setIsManager(response?.role === 'manager');
      }
    };
    // fetch current user only when a user signed in
    if (!currentUser) {
      fetchCurrentUser();
    } else {
      setIsManager(currentUser.role === 'manager');
    }
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      await fetchDashboard();
    };
    fetchDashboardData();
  }, [isChange]);

  return (
    <>
      {currentUser && (
        <div className={BASE_CLASS}>
          {isManager && (
            <>
              {dashboard && <Dashboard managerDashboard={dashboard} />}
              {dashboard && <TodayBar todayBar={dashboard.today} />}
            </>
          )}
          {!isManager && (
            <>
              {dashboard && <InstructorDashBoard dashboard={dashboard} setChange={setChange} />}
              {dashboard && <InstructorTodayBar todayBar={dashboard.today} />}
            </>
          )}
        </div>
      )}
    </>
  );
}
