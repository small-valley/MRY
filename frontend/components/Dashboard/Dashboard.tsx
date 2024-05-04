import React from 'react';
import Chart from './Chart';
import OngoingList from './OngoingList';
import UpcomingList from './UpcomingList';

const BASE_CLASS = 'home_dashboard';

export default function Dashboard() {
  return (
    <div className={BASE_CLASS}>
      <div>
        <Chart />
        <OngoingList />
      </div>
      <UpcomingList />
    </div>
  );
}
