import React, { useContext, useEffect, useState } from 'react';
import { MockchangeDate, changeDate } from '@/app/actions/common';
import { CohortsContext } from '@/app/contexts/CohortsContext';
import { GetCohortsResponse } from '../../../shared/models/responses/getCohortsResponse';
import Calendar from 'react-calendar';
import { CalendarCheck } from 'lucide-react';

const BASE_CLASS = 'schedule_table';

interface CohortForScheduleList {
  name: string;
  program: string;
  progress: number;
  scheduleLen: number;
  period: string;
  room: string;
  startDate: string;
  endDate: string;
  status: string;
}

export default function ScheduleListTable() {
  const { cohorts } = useContext(CohortsContext);
  const [startDate, setStartdate] = useState<Date>();
  const [endDate, setEnddate] = useState<Date>();
  const [isCalandar, setIsCalandar] = useState<boolean>(false);

  const Cohorts = cohorts?.map((item: GetCohortsResponse) => {
    const today = new Date();
    let startDate = new Date(item.schedules[0].startDate);
    let endDate = new Date(item.schedules[0].endDate);
    let progress = 0;
    let status = 'ongoing';
    item.schedules.forEach((obj) => {
      let tmpStart = new Date(obj.startDate);
      let tmpEnd = new Date(obj.endDate);
      if (tmpStart < startDate) {
        startDate = tmpStart;
      }
      if (tmpEnd > endDate) {
        endDate = tmpEnd;
      }
      if (tmpEnd < today) {
        progress++;
      }
    });
    if (progress === item.schedules.length) {
      status = 'finished';
    } else if (progress === 0) {
      status = 'upcoming';
    }
    return {
      name: item.name,
      program: item.program,
      progress: progress,
      scheduleLen: item.schedules.length,
      period: item.period,
      room: item.room,
      startDate: MockchangeDate(startDate),
      endDate: MockchangeDate(endDate),
      status: status,
    };
  });

  useEffect(() => {
    let startDate = new Date();
    let endDate = new Date();
    cohorts?.map((cohort) => {
      cohort?.schedules?.map((schedule) => {
        if (new Date(schedule.startDate) < startDate) {
          startDate = new Date(schedule.startDate);
        }
        if (new Date(schedule.endDate) > endDate) {
          endDate = new Date(schedule.endDate);
        }
      });
    });
    setStartdate(new Date(startDate));
    setEnddate(new Date(endDate));
  }, [cohorts]);

  const handleDateChange = (event: any) => {
    setIsCalandar(false);
    setStartdate(event[0]);
    setEnddate(event[1]);
  };
  return (
    <>
      <div className={`${BASE_CLASS}_listfilter`}>
        <div className={`${BASE_CLASS}_listfilter_first`}>
          <button
            className={`${BASE_CLASS}_listfilter_first_btn`}
            onClick={() => (isCalandar ? setIsCalandar(false) : setIsCalandar(true))}
          >
            <CalendarCheck />
            <h2>{startDate && changeDate(startDate)}</h2>-<h2>{endDate && changeDate(endDate)}</h2>
          </button>{' '}
        </div>
        <div className={`init_calendarlist ${isCalandar ? 'calender_list' : ''}`}>
          <Calendar
            onChange={handleDateChange}
            value={startDate && endDate && [startDate, endDate]}
            selectRange={true}
          />
        </div>
      </div>
      <ul className={BASE_CLASS}>
        <li className={`${BASE_CLASS}_listheader`} key="list-header">
          <div>Start Date</div>
          <div>End Date</div>
          <div>Cohort</div>
          <div>Program</div>
          <div>Progress</div>
          <div>Period</div>
          <div>Room</div>
          <div>Days</div>
        </li>
        {Cohorts?.map((cohort: CohortForScheduleList, index: number) => (
          <li className={`${BASE_CLASS}_listcontent ${cohort.status}`} key={`${cohort.name}-${index}`}>
            <div>{cohort.startDate}</div>
            <div>{cohort.endDate}</div>
            <div>{cohort.name}</div>
            <div>{cohort.program}</div>
            <div>
              {cohort.progress}/{cohort.scheduleLen}
            </div>
            <div className={cohort.period}>{cohort.period}</div>
            <div>{cohort.room}</div>

            {cohort.period === 'weekend' ? <div>Sat - Sun</div> : <div>Mon - Fri</div>}
          </li>
        ))}
      </ul>
    </>
  );
}
