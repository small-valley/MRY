import { changeDate } from '@/app/actions/common';

import { toggleEditSchedule } from '@/type/cohorts';
import { Check, X } from 'lucide-react';
import { Dispatch, SetStateAction, useState } from 'react';

import Calendar from 'react-calendar';
import { PutScheduleCourseRequest } from '../../../shared/models/requests/putScheduleRequest';
import { Course } from '../../../shared/models/responses/getCohortResponse';

import { updateSchedule } from '@/app/actions/cohorts';
import useDays from '@/app/hooks/programs/useDays';
type Props = {
  course: Course;
  toggleEditSchedule: toggleEditSchedule;
  setChange: Dispatch<SetStateAction<number>>;
};

type day = {
  id: string;
  name: string;
};

const BASE_CLASS = 'cohort_table_content';
export default function CourseRowEdit({ course, toggleEditSchedule, setChange }: Props) {
  const { days, fetchDays } = useDays();
  const [startDate, setStartdate] = useState<Date>(course.startDate || null);
  const [endDate, setEnddate] = useState<Date>(course.endDate || null);
  const [day, setDayId] = useState<day>({ id: course.dayId, name: course.days } || '');
  const [isCalandar, setIsCalandar] = useState<boolean>(false);
  const [isDay, setIsDays] = useState<boolean>(false);

  const handleDateChange = (event: any) => {
    setIsCalandar(false);
    setStartdate(event[0]);
    setEnddate(event[1]);
  };

  const tileDisabled = ({ date, view }: any) => {
    if (view === 'month') {
      return (
        date.getDay() === 2 || // Tuesday
        date.getDay() === 3 || // Wednesday
        date.getDay() === 4 || // Thursday
        date.getDay() === 6 || // Saturday
        date.getDay() === 0 // Sunday
      );
    }
    return false;
  };

  const handleUpdateSchedule = async () => {
    if (startDate != course.startDate || endDate != course.endDate || day.id != course.dayId) {
      const schedule: PutScheduleCourseRequest = {
        scheduleId: course.scheduleId,
        startDate: typeof startDate === 'string' ? startDate : startDate.toDateString(),
        endDate: typeof endDate === 'string' ? endDate : endDate.toDateString(),
        courseId: course.courseId,
        dayId: day.id,
      };

      try {
        const success = await updateSchedule(schedule);
        if (success) {
          setChange(Math.random());
        }
      } catch (error: any) {
        console.log('fail update');
      }
    }
    toggleEditSchedule(course.scheduleId);
  };
  return (
    <>
      <div className={`${BASE_CLASS}_edit`}>
        <button
          type="button"
          onClick={() => {
            setIsCalandar(true);
          }}
          className={`${BASE_CLASS}_edit_date`}
        >
          {changeDate(startDate)} / {changeDate(endDate)}
        </button>
        <div>{course.name}</div>
        <button
          type="button"
          className={`${BASE_CLASS}_edit_date`}
          onClick={() => {
            setIsDays(true);
          }}
        >
          {day.name}
        </button>
        <div>{course.instructor}</div>
      </div>
      <div className={`${BASE_CLASS}_edit_btn`}>
        <button type="button" className="save" onClick={handleUpdateSchedule}>
          <Check size={20} />
        </button>
        <button className="del">
          <X size={20} onClick={() => toggleEditSchedule(course.scheduleId)} />
        </button>
      </div>
      <div className={`calender_popup ${isCalandar ? 'calender_popup_selected' : ''}`}>
        <div className="calender_popup_selected_wrap">
          <h2> Select Date</h2>
          <Calendar
            onChange={handleDateChange}
            value={[startDate, endDate]}
            selectRange={true}
            tileDisabled={tileDisabled}
          />
          <button className="close" onClick={() => setIsCalandar(false)}>
            Close
          </button>
        </div>
      </div>
      <div className={`period_init_popup ${isDay ? 'period_popup_selected' : ''}`}>
        <div className="period_popup_selected_wrap">
          {days &&
            days.map((obj) => (
              <button
                type="button"
                className={`cohort_edit_btn_days`}
                onClick={() => {
                  setIsDays(false);
                  setDayId({ id: obj.id, name: obj.name });
                }}
              >
                {obj.name}
              </button>
            ))}
          <button
            className={`cohort_edit_btn_close`}
            type="button"
            onClick={() => {
              setIsDays(false);
            }}
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}
