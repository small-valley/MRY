import React from 'react';
import { Today } from '../../../shared/models/responses/getDashboardResponse';

const BASE_CLASS = 'home_todaybar';

type Props = {
  todayBar: Today[];
};

export default function TodayBar({ todayBar }: Props) {
  return (
    <div className={BASE_CLASS}>
      <h1> Today</h1>
      {todayBar.map((today, index) => (
        <li key={`${index}-${today.cohortId}-${today.cohortName}`}>
          <div>
            <h3>{today.courseName}</h3>
            <p className={today.period}>{today.period}</p>
          </div>
          <label>{today.instructor}</label>
          <div>
            {today.cohortName} / {today.room}
          </div>
        </li>
      ))}
    </div>
  );
}
