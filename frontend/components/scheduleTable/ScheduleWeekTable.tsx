import React, { useContext, useEffect, useState } from 'react';
import CourseWeek from './CourseWeek';
import { GetCohortsResponse } from '../../../shared/models/responses/getCohortsResponse';
import { CohortsContext } from '@/app/contexts/CohortsContext';
import { CalendarCheck } from 'lucide-react';
import { changeDate } from '@/app/actions/common';
import ReactDatePicker from 'react-datepicker';
import Calendar from 'react-calendar';

const BASE_CLASS = 'schedule_table';

export default function ScheduleWeekTable() {
  const { cohorts } = useContext(CohortsContext);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCalandar, setIsCalandar] = useState<boolean>(false);

  const morningCohort = cohorts
    .filter((item: GetCohortsResponse) => item.period === 'Morning')
    .map(({ name, room, schedules }: GetCohortsResponse) => ({
      name,
      room,
      schedules,
    }));
  const afternoonCohort = cohorts
    .filter((item: GetCohortsResponse) => item.period === 'Afternoon')
    .map(({ name, room, schedules }: GetCohortsResponse) => ({
      name,
      room,
      schedules,
    }));
  const eveningCohort = cohorts
    .filter((item: GetCohortsResponse) => item.period === 'Evening')
    .map(({ name, room, schedules }: GetCohortsResponse) => ({
      name,
      room,
      schedules,
    }));
  const weekendCohort = cohorts
    .filter((item: GetCohortsResponse) => item.period === 'Weekend')
    .map(({ name, room, schedules }: GetCohortsResponse) => ({
      name,
      room,
      schedules,
    }));

  const handleDateChange = (event: any) => {
    setIsCalandar(false);
    setSelectedDate(event);
  };

  const tileDisabled = ({ date, view }: any) => {
    if (view === 'month') {
      const dayOfWeek = date.getDay();
      if (
        dayOfWeek === 2 || // Tuesday
        dayOfWeek === 3 || // Wednesday
        dayOfWeek === 4 || // Thursday
        dayOfWeek === 5 || // Friday
        dayOfWeek === 6 || // Saturday
        dayOfWeek === 0 // Sunday
      ) {
        return true;
      }
    }
    return false;
  };
  return (
    <>
      <div className={`${BASE_CLASS}_listfilter`}>
        <div>
          <button onClick={() => setIsCalandar(true)}>
            <CalendarCheck />
          </button>
          <span>{selectedDate && changeDate(selectedDate)}</span>
        </div>
        <div className={`init_calendarlist ${isCalandar ? 'calender_list' : ''}`}>
          <div className="calender_list_wrap">
            <Calendar
              onChange={handleDateChange}
              value={selectedDate}
              selectRange={false}
              tileDisabled={tileDisabled}
            />
            <button className="close" onClick={() => setIsCalandar(false)}>
              Close
            </button>
          </div>
        </div>
      </div>
      <div className={BASE_CLASS}>
        <div className={`${BASE_CLASS}_weekheader`}>
          <div></div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thur</div>
          <div>Fri</div>
          <div>Sat</div>
          <div>Sun</div>
        </div>
        <div className={`${BASE_CLASS}_weekcontent`}>
          <div>Morning</div>
          <div className="monday">
            {morningCohort.map((cohort, index) => (
              <CourseWeek
                key={`${cohort.name}-${index}`}
                schedules={cohort.schedules}
                name={cohort.name}
                room={cohort.room}
              />
            ))}
          </div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className={`${BASE_CLASS}_weekcontent`}>
          <div>Afternoon</div>
          <div>
            {afternoonCohort.map((cohort, index) => (
              <CourseWeek
                key={`${cohort.name}-${index}`}
                schedules={cohort.schedules}
                name={cohort.name}
                room={cohort.room}
              />
            ))}
          </div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className={`${BASE_CLASS}_weekcontent`}>
          <div>Evening</div>
          <div>
            {eveningCohort.map((cohort, index) => (
              <CourseWeek
                key={`${cohort.name}-${index}`}
                schedules={cohort.schedules}
                name={cohort.name}
                room={cohort.room}
              />
            ))}
          </div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className={`${BASE_CLASS}_weekcontent`}>
          <div>Weekend</div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div>
            {weekendCohort.map((cohort, index) => (
              <div key={`${cohort.name}-${index}`} className={`courseWeekend ${cohort.schedules[0].course.color}`}>
                {cohort.schedules[0].course.name} / {cohort.name} / {cohort.room}
              </div>
            ))}
          </div>
          <div></div>
        </div>
      </div>
    </>
  );
}
