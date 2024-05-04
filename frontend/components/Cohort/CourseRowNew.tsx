import { changeDate } from '@/app/actions/common';

import { toggleNewSchedule } from '@/type/cohorts';
import { Check, X } from 'lucide-react';
import { Dispatch, SetStateAction, useState } from 'react';

import Calendar from 'react-calendar';
import { PostScheduleCourseRequest } from '../../../shared/models/requests/postScheduleRequest';

import { createSchedule } from '@/app/actions/cohorts';
import useDays from '@/app/hooks/programs/useDays';
import usePrograms from '@/app/hooks/programs/usePrograms';
type Props = {
  cohortId: string;
  programId: string;
  toggleNewSchedule: toggleNewSchedule;
  setChange: Dispatch<SetStateAction<number>>;
};

type nameSet = {
  id: string;
  name: string;
};

const BASE_CLASS = 'cohort_table_content';
export default function CourseRowNew({ cohortId, programId, toggleNewSchedule, setChange }: Props) {
  const { programs, fetchPrograms } = usePrograms();
  const { days, fetchDays } = useDays();
  const [startDate, setStartdate] = useState<Date>();
  const [endDate, setEnddate] = useState<Date>();
  const [day, setDayId] = useState<nameSet>({ id: '', name: 'select Days' } || '');
  const [course, setCourse] = useState<nameSet>({ id: '', name: 'select Course' } || '');
  const [isCalandar, setIsCalandar] = useState<boolean>(false);
  const [isDay, setIsDays] = useState<boolean>(false);
  const [isCourse, setIsCourse] = useState<boolean>(false);
  const [isToast, setIsToast] = useState<boolean>(false);
  const [toast, setToast] = useState<string>('');

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

  const handleCreateSchedule = async () => {
    if (startDate && endDate && day.id && course.id) {
      const schedule: PostScheduleCourseRequest = {
        cohortId: cohortId,
        startDate: changeDate(startDate),
        endDate: changeDate(endDate),
        courseId: course.id,
        dayId: day.id,
      };
      try {
        const success = await createSchedule(schedule);
        if (success) {
          setChange(Math.random());
          toggleNewSchedule();
        }
      } catch (error: any) {
        setToast('It can not create schedule, check hour and date');
        setIsToast(true);
        setTimeout(() => {
          setToast('');
          setIsToast(false);
        }, 5000);
      }
    } else {
      setToast('Please Select Date, Days and Course');
      setIsToast(true);
      setTimeout(() => {
        setToast('');
        setIsToast(false);
      }, 5000);
      return;
    }
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
          {startDate && changeDate(startDate)} / {endDate && changeDate(endDate)}
        </button>
        <button
          type="button"
          className={`${BASE_CLASS}_edit_date`}
          onClick={() => {
            setIsCourse(true);
          }}
        >
          {course.name}
        </button>
        <button
          type="button"
          className={`${BASE_CLASS}_edit_date`}
          onClick={() => {
            setIsDays(true);
          }}
        >
          {day.name}
        </button>
        {/* <div>null</div> */}
      </div>
      <div className={`${BASE_CLASS}_edit_btn`}>
        <button type="button" className="save" onClick={handleCreateSchedule}>
          <Check size={20} />
        </button>
        <button type="button" className="del">
          <X size={20} onClick={toggleNewSchedule} />
        </button>
      </div>
      <div className={`calender_popup ${isCalandar ? 'calender_popup_selected' : ''}`}>
        <div className="calender_popup_selected_wrap">
          <h2> Select Date</h2>
          <Calendar
            onChange={handleDateChange}
            value={startDate && endDate && [startDate, endDate]}
            minDate={new Date()}
            selectRange={true}
            tileDisabled={tileDisabled}
          />
          <button type="button" className="close" onClick={() => setIsCalandar(false)}>
            Close
          </button>
        </div>
      </div>
      <div className={`period_init_popup ${isDay ? 'period_popup_selected' : ''}`}>
        <div className="period_popup_selected_wrap">
          {days &&
            days.map((obj) => (
              <button
                key={obj.id}
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
      <div className={`course_init_popup ${isCourse ? 'course_popup_selected' : ''}`}>
        <div className="course_popup_selected_wrap">
          <h2>Select Course</h2>
          <div className="course_popup_selected_wrap_course">
            {programs &&
              programs.map((program) => {
                return (
                  program.id === programId &&
                  program.courses.map((course) => (
                    <button
                      key={course.id}
                      type="button"
                      className={`cohort_edit_btn_days`}
                      onClick={() => {
                        setIsCourse(false);
                        setCourse({ id: course.id, name: course.name });
                      }}
                    >
                      {course.name}
                    </button>
                  ))
                );
              })}
          </div>
          <button
            className={`cohort_edit_btn_close`}
            type="button"
            onClick={() => {
              setIsCourse(false);
            }}
          >
            Close
          </button>
        </div>
      </div>
      <div className={`toast_init_popup ${isToast ? 'toast' : ''}`}>
        <div className="toast_wrap">{toast}</div>
      </div>
    </>
  );
}
