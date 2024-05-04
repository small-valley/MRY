'use client';

import Dashboard from '@/components/Dashboard/Dashboard';
import './home.scss';
import TodayBar from '@/components/Dashboard/TodayBar';
import { useState } from 'react';
import InstructorDashBoard from '@/components/Dashboard/InstructorDashBoard';
import InstructorTodayBar from '@/components/Dashboard/InstructorTodayBar';

const BASE_CLASS = 'home';

export default function Home() {
  const [isManager, setIsManager] = useState<boolean>(false);
  return (
    <div className={BASE_CLASS}>
      {isManager && (
        <>
          <Dashboard />
          <TodayBar />
        </>
      )}
      {!isManager && (
        <>
          <InstructorDashBoard />
          <InstructorTodayBar />
        </>
      )}
    </div>
  );
}
