import { Search } from 'lucide-react';
import React from 'react';

const BASE_CLASS = 'home_todaybar';

type today = {
  cohortId: string;
  cohortName: string;
  courseName: string;
  period: string;
  room: string;
  instructor: string;
};
const tmp: today[] = [
  {
    cohortId: 'aaa',
    cohortName: 'E1-0124',
    courseName: 'Analytics',
    period: 'Evening',
    room: 'Facebook',
    instructor: 'Mriam',
  },
  {
    cohortId: 'bbb',
    cohortName: 'E2-0124',
    courseName: 'Advanced Strategies',
    room: 'Facebook',
    instructor: 'Mriam',
    period: 'Evening',
  },
  {
    cohortId: 'ccc',
    cohortName: 'E2-0124',
    courseName: 'E-commerce',
    room: 'Facebook',
    instructor: 'Mriam',
    period: 'Afternoon',
  },
  {
    cohortId: 'ddd',
    cohortName: 'A1-0124',
    room: 'Facebook',
    instructor: 'Mriam',
    period: 'Morning',
    courseName: 'Program Project',
  },
  {
    cohortId: 'eee',
    cohortName: 'E3-0124',
    room: 'Facebook',
    instructor: 'Mriam',
    period: 'Afternoon',
    courseName: 'Analytics',
  },
  {
    cohortId: 'ccc',
    cohortName: 'E2-0124',
    courseName: 'E-commerce',
    room: 'Facebook',
    instructor: 'Mriam',
    period: 'Afternoon',
  },
  {
    cohortId: 'ddd',
    cohortName: 'A1-0124',
    room: 'Facebook',
    instructor: 'Mriam',
    period: 'Morning',
    courseName: 'Program Project',
  },
  {
    cohortId: 'eee',
    cohortName: 'E3-0124',
    room: 'Facebook',
    instructor: 'Mriam',
    period: 'Afternoon',
    courseName: 'Analytics',
  },
];

export default function TodayBar() {
  return (
    <div className={BASE_CLASS}>
      <h1> Today</h1>
      <input type="text" placeholder="Search Course" />
      {tmp.map((today, index) => (
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
