'use client';
import React, { useState } from 'react';
import GanttChart from '../../components/ganttChart/GanttChart';
import './schedules.scss';
import ScheduleListTable from '@/components/scheduleTable/ScheduleListTable';
import ScheduleMonthTable from '@/components/scheduleTable/ScheduleMonthTable';
import { CohortsProvider } from '@/app/contexts/CohortsContext';

const BASE_CLASS = 'schedule';
const BTN_BASE_CLASS = 'schedule_btn';

export default function Schedules() {
  const [isList, setList] = useState(false);
  const [isMonth, setMonth] = useState(false);

  const [isGantt, setGantt] = useState(true);

  const toggleList = () => {
    setList(true);
    setMonth(false);

    setGantt(false);
  };
  const toggleMonth = () => {
    setList(false);
    setMonth(true);

    setGantt(false);
  };

  const toggleGantt = () => {
    setList(false);
    setMonth(false);

    setGantt(true);
  };

  return (
    <CohortsProvider>
      <div className={BASE_CLASS}>
        <div className={`${BASE_CLASS}_header`}>
          <div className={`${BASE_CLASS}_header_filter_btn`}>
            <button type="button" className={`${BTN_BASE_CLASS}_list`} onClick={toggleGantt}>
              Gantt
            </button>
            <button type="button" className={`${BTN_BASE_CLASS}_list`} onClick={toggleList}>
              List
            </button>
            <button type="button" className={`${BTN_BASE_CLASS}_list`} onClick={toggleMonth}>
              Month
            </button>
          </div>
        </div>
        {isList && (
          <>
            <ScheduleListTable />
          </>
        )}
        {isMonth && (
          <>
            <ScheduleMonthTable />
          </>
        )}
        {isGantt && (
          <>
            <GanttChart />
          </>
        )}
      </div>
    </CohortsProvider>
  );
}
