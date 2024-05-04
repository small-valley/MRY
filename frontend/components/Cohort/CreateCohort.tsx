'use client';
import { createCohort, getCohortById, getRecentCohortByProgram } from '@/app/actions/cohorts';
import { changeDate } from '@/app/actions/common';
import useDays from '@/app/hooks/programs/useDays';
import usePeriod from '@/app/hooks/programs/usePeriod';
import usePrograms from '@/app/hooks/programs/usePrograms';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import { PostCohortRequest, Schedule } from '../../../shared/models/requests/postCohortRequest';
import { GetCohortResponse } from '../../../shared/models/responses/getCohortResponse';
import { GetRecentCohortResponse } from '../../../shared/models/responses/getRecentCohortResponse';
import './CreateCohort.scss';
const BASE_CLASS = 'cohort_create';

type Props = {
  start: number;
  setCohortId: Dispatch<SetStateAction<string>>;
  setChange: Dispatch<SetStateAction<number>>;
  setIsCreate: Dispatch<SetStateAction<boolean>>;
};

type IdName = {
  id: string;
  name: string;
};
type Course = {
  startDate: Date | null;
  endDate: Date | null;
  courseId: string;
  courseName: string;
  dayId: string;
  dayName: string;
  hour: number;
  currenthour: number | null;
};

export default function CreateCohort({ setCohortId, setChange, setIsCreate, start }: Props) {
  //Basic Data
  const { programs, fetchPrograms } = usePrograms();
  const { period, fetchPeriod } = usePeriod();
  const { days, fetchDays } = useDays();
  //Error Message
  const [message, setMessage] = useState<string>('');

  //Create Course Step
  const [step, setStep] = useState<number>(start);
  // Sending Data forat
  const [newProgram, setNewProgram] = useState<IdName>({ id: '', name: '' });
  const [newCohort, setNewCohort] = useState<string>('');
  const [newPeriod, setNewPeriod] = useState<IdName>({ id: '', name: '' });
  const [newCourses, setNewCourses] = useState<Course[]>();
  const [newDay, setNewDay] = useState<IdName>({ id: '', name: '' });

  //generate Cohorts by imported cohort
  const [recentCohorts, setRecentCohorts] = useState<GetRecentCohortResponse[]>();
  const [importCohort, setImportCohort] = useState<GetCohortResponse>();

  //to update Date and Period
  const [index, setIndex] = useState<number>(0);
  const [isCalandar, setIsCalandar] = useState<boolean>(false);
  const [isDays, setIsDays] = useState<boolean>(false);
  const [sort, setSort] = useState<number>(0);

  // To get Estimate EndDate
  const [cohortStartDate, setCohortStartDate] = useState<Date>();
  const [estimateDate, setEstimateDate] = useState<Date>();
  const [programHour, setProgramHour] = useState<number>(0);

  console.log(step);
  const fetchRecentData = async () => {
    try {
      const cohortData = await getRecentCohortByProgram(newProgram.id);
      setRecentCohorts(cohortData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchCohortData = async (id: string) => {
    try {
      const cohortData = await getCohortById(id);
      setImportCohort(cohortData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (!importCohort) {
      return;
    }
    const tmpCourse: Course[] = [];

    importCohort.course.forEach((course) => {
      if (course.name != 'Break') {
        tmpCourse.push({
          startDate: new Date(course.startDate),
          endDate: new Date(course.endDate),
          courseId: course.courseId,
          courseName: course.name,
          dayId: course.dayId,
          dayName: course.days,
          hour: course.courseHour,
          currenthour: course.currentHour,
        });
      }
    });

    setNewCourses(tmpCourse);
    setStep(100);
  }, [importCohort]);
  useEffect(() => {
    if (!newProgram) {
      return;
    }
    fetchRecentData();

    //when user Select Start Date It will show Estimate Date
    if (!programs) {
      return;
    }
    var sum = 0;
    programs.forEach((program) => {
      if (program.name === newProgram.name) {
        program.courses.forEach((course) => {
          sum += course.hour;
        });
      }
    });
    setProgramHour(sum);
  }, [newProgram]);
  //get days
  useEffect(() => {
    if (!days) {
      return;
    }
    days.forEach((day) => {
      if (day.name === 'Monday - Friday') {
        setNewDay({ id: day.id, name: day.name });
      }
    });
  }, [days]);

  //sorting new courses when date change
  useEffect(() => {
    if (!newCourses) {
      return;
    }
    const sortedCourses = [...newCourses].sort((a, b) => {
      if (a.startDate === null && b.startDate === null) {
        return 0;
      } else if (a.startDate === null) {
        return 1;
      } else if (b.startDate === null) {
        return -1;
      } else {
        return a.startDate.getTime() - b.startDate.getTime();
      }
    });
    setNewCourses(sortedCourses);

    var starDate = newCourses[0].startDate;
    if (starDate) {
      // -3 to set EndDate on Friday
      var programDay = (7 * (programHour / 20) - 3) * 1000 * 60 * 60 * 24;
      var tmpEstimateDate = new Date(starDate.getTime() + programDay);
      setEstimateDate(tmpEstimateDate);
      setCohortStartDate(starDate);
    }
  }, [sort]);

  const handleStepOne = (formData: any) => {
    setNewCohort(formData.get('Cohort'));
    setStep(1);
  };

  const handleGenerateNewCourse = () => {
    const tmpCourse: Course[] = [];

    console.log(programs);
    programs?.forEach((program) => {
      if (program.id === newProgram.id) {
        program.courses.forEach((course) => {
          tmpCourse.push({
            startDate: null,
            endDate: null,
            courseId: course.id,
            courseName: course.name,
            dayId: newDay.id,
            dayName: newDay.name,
            hour: course.hour,
            currenthour: null,
          });
        });
      }
    });
    console.log(tmpCourse);

    setNewCourses(tmpCourse);
    setStep(100);
  };

  const handleGenerateImportCourse = (id: string) => {
    fetchCohortData(id);
  };

  const updateDate = (event: any) => {
    if (!newCourses) {
      return;
    }
    const tmpCourse: Course[] = [...newCourses];
    var tmpStart = new Date(event);
    var tmpEnd = new Date();
    var hour = tmpCourse[index].hour;
    var day = tmpCourse[index].dayName;
    var currenthour = 0;

    if (day === 'Monday - Friday') {
      //get week by 20 hour and get friday as a endDate
      var week = hour / 20;
      var wordays = (7 * week - 3) * 1000 * 60 * 60 * 24;
      tmpEnd.setTime(tmpStart.getTime() + wordays);
      var differenceMs = tmpEnd.getTime() - tmpStart.getTime();
      var differenceDays = differenceMs / (1000 * 60 * 60 * 24);
      differenceDays = Math.round(differenceDays);
      currenthour = Math.ceil(differenceDays / 7) * 20;
    } else {
      //get week by 10 hour and  get friday as a endDate
      var week = hour / 10;
      var wordays = (7 * week - 3) * 1000 * 60 * 60 * 24;
      tmpEnd.setTime(tmpStart.getTime() + wordays);
      var differenceMs = tmpEnd.getTime() - tmpStart.getTime();
      var differenceDays = differenceMs / (1000 * 60 * 60 * 24);
      differenceDays = Math.round(differenceDays);
      currenthour = Math.ceil(differenceDays / 7) * 10;
    }

    tmpCourse[index] = { ...tmpCourse[index], startDate: tmpStart, endDate: tmpEnd, currenthour: currenthour };

    console.log(tmpCourse[index]);
    setNewCourses(tmpCourse);
    setSort(Math.random());
    setIsCalandar(false);
  };

  const updatePeriod = (id: string, name: string) => {
    if (!newCourses) {
      return;
    }
    const tmpCourse: Course[] = [...newCourses];
    var tmpStart = tmpCourse[index].startDate;
    var tmpEnd = new Date();
    var hour = tmpCourse[index].hour;
    var day = name;
    var currenthour;
    if (tmpStart) {
      if (day === 'Monday - Friday') {
        //get week by 20 hour and get friday as a endDate
        var week = hour / 20;
        var wordays = (7 * week - 3) * 1000 * 60 * 60 * 24;
        tmpEnd.setTime(tmpStart.getTime() + wordays);
        var differenceMs = tmpEnd.getTime() - tmpStart.getTime();
        var differenceDays = differenceMs / (1000 * 60 * 60 * 24);
        differenceDays = Math.round(differenceDays);
        currenthour = Math.ceil(differenceDays / 7) * 20;
      } else {
        //get week by 10 hour and  get friday as a endDate
        var week = hour / 10;
        var wordays = (7 * week - 3) * 1000 * 60 * 60 * 24;
        tmpEnd.setTime(tmpStart.getTime() + wordays);
        var differenceMs = tmpEnd.getTime() - tmpStart.getTime();
        var differenceDays = differenceMs / (1000 * 60 * 60 * 24);
        differenceDays = Math.round(differenceDays);
        currenthour = Math.ceil(differenceDays / 7) * 10;
      }

      tmpCourse[index] = {
        ...tmpCourse[index],
        startDate: tmpStart,
        endDate: tmpEnd,
        currenthour: currenthour,
        dayId: id,
        dayName: name,
      };
    } else {
      tmpCourse[index] = { ...tmpCourse[index], dayId: id, dayName: name };
    }
    tmpCourse[index] = { ...tmpCourse[index], dayId: id, dayName: name };

    setNewCourses(tmpCourse);
    setIsDays(false);
  };

  const handleCreateCohort = async (formData: any) => {
    if (!newCourses) {
      return;
    }
    var today = new Date();
    if (newCourses[0].startDate && newCourses[0].startDate < today) {
      setMessage('Please Check Start Date. It can not select past day');
      setTimeout(() => {
        setMessage('');
      }, 5000);
      return;
    }

    const tmpSchedule: Schedule[] = [];
    var dateCheck = true;
    newCourses.map((course) => {
      if (course.startDate && course.endDate) {
        tmpSchedule.push({
          startDate: typeof course.startDate === 'string' ? course.startDate : course.startDate.toDateString(),
          endDate: typeof course.endDate === 'string' ? course.endDate : course.endDate.toDateString(),
          courseId: course.courseId,
          dayId: course.dayId,
        });
      } else {
        dateCheck = false;
      }
    });
    if (!dateCheck) {
      setMessage('Please Select Schedule Date');
      setTimeout(() => {
        setMessage('');
      }, 5000);
      return;
    }
    const tmpCohort: PostCohortRequest = {
      programId: newProgram.id,
      cohortName: newCohort,
      periodId: newPeriod.id,
      schedules: tmpSchedule,
    };

    try {
      const id = await createCohort(tmpCohort);
      console.log(id);
      if (id) {
        setChange(Math.random());
        setCohortId(id.cohortId);
        setIsCreate(false);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const tileDisabled = ({ date, view }: any) => {
    if (view === 'month') {
      return (
        date.getDay() === 2 || // Tuesday
        date.getDay() === 3 || // Wednesday
        date.getDay() === 4 || // Thursday
        date.getDay() === 5 || // Thursday
        date.getDay() === 6 || // Saturday
        date.getDay() === 0 // Sunday
      );
    }
    return false;
  };
  return (
    <div className={BASE_CLASS}>
      <div className={`${BASE_CLASS}_header`}>
        <h2>
          Create New Course{' '}
          <button
            className={`${BASE_CLASS}_reset`}
            onClick={() => {
              setNewProgram({ id: '', name: '' });
              setNewPeriod({ id: '', name: '' });
              setNewCohort('');
              setNewCourses([]);
              setStep(Math.random());
              setStep(0);
            }}
          >
            Reset
          </button>
        </h2>
        <div className={`${BASE_CLASS}_header_detail`}>
          <h3>Cohort Name</h3>
          <p>{newCohort} </p>
        </div>
        <div className={`${BASE_CLASS}_header_detail`}>
          <h3>Program</h3>
          <p>
            <span className="create_program"> {newProgram.name} </span>- {programHour}h / {programHour / 20}weeks
          </p>
        </div>
        <div className={`${BASE_CLASS}_header_detail`}>
          <h3>Period</h3>
          <p className={newPeriod.name}> {newPeriod.name}</p>
        </div>
        <div className={`${BASE_CLASS}_header_detail`}>
          <h4> Estimate end date is Based on Program Hour</h4>
        </div>
        <div className={`${BASE_CLASS}_header_detail`}>
          <h4> Please Add Break Schedule after Save the New Cohort</h4>
        </div>

        <div className={`${BASE_CLASS}_header_detail`}>
          <div> Cohort Start Date : {cohortStartDate && changeDate(cohortStartDate)}</div>
          <div> Estimate End Date : {estimateDate && changeDate(estimateDate)}</div>
        </div>
        <div className={`${BASE_CLASS}_header_detail`}>
          <h4> {message}</h4>
        </div>
      </div>
      <div className={`${BASE_CLASS}_courses`}>
        <li>
          <h4>Date</h4>
          <h4>Course</h4>
          <h4>Day</h4>
        </li>
        {newCourses &&
          newCourses.map((course, index) => (
            <li key={`${index}-${course.courseId}-${course.courseName}`}>
              <button
                className={`${BASE_CLASS}_date`}
                onClick={() => {
                  setIsCalandar(true);
                  setIndex(index);
                }}
              >
                <span className="startdate">{course.startDate && changeDate(course.startDate)} </span>-{' '}
                <span className="enddate">{course.endDate && changeDate(course.endDate)}</span>
              </button>
              <label>
                {course.courseName} - {course.currenthour && course.currenthour}/ {course.hour}h
              </label>
              <button
                className={`${BASE_CLASS}_date`}
                onClick={() => {
                  setIsDays(true);
                  setIndex(index);
                }}
              >
                {course.dayName}
              </button>
            </li>
          ))}
      </div>
      <div>
        <button className={`${BASE_CLASS}_save`} onClick={handleCreateCohort}>
          Save
        </button>
        <button
          className={`${BASE_CLASS}_cancel`}
          onClick={() => {
            setNewProgram({ id: '', name: '' });
            setNewPeriod({ id: '', name: '' });
            setNewCohort('');
            setNewCourses([]);
            setStep(0);
            setIsCreate(false);
          }}
        >
          Cancel
        </button>
      </div>
      <div className={`calender_popup ${isCalandar ? 'calender_popup_selected' : ''}`}>
        <div className="calender_popup_selected_wrap">
          <h2> Select Date</h2>
          <Calendar onChange={updateDate} minDate={new Date()} selectRange={false} tileDisabled={tileDisabled} />
          <button className="close" onClick={() => setIsCalandar(false)}>
            Close
          </button>
        </div>
      </div>
      <div className={`init_popup ${isDays ? 'active_popup ' : ''}`}>
        <div className="active_popup_wrap">
          <div className="active_popup_wrap_content">
            <h2> Select days</h2>
            {days &&
              days.map((obj) => (
                <button
                  className="content-btn"
                  onClick={() => {
                    updatePeriod(obj.id, obj.name);
                  }}
                >
                  {obj.name}
                </button>
              ))}
          </div>
          <div className="active_popup_wrap_btn">
            <button className="close" onClick={() => setIsDays(false)}>
              Close
            </button>
          </div>
        </div>
      </div>
      <div className={`init_popup ${step === 0 ? 'active_popup' : ''}`}>
        <form className="active_popup_wrap" action={handleStepOne}>
          <div className="active_popup_wrap_content">
            <h2>Write a Cohort Name</h2>
            <input type="text" name="Cohort" required />
          </div>
          <div className="active_popup_wrap_btn">
            <button
              className="popup_btn"
              onClick={() => {
                setIsCreate(false);
                setChange(Math.random());
              }}
            >
              Cancel
            </button>
            <button className="popup_btn" type="submit">
              Next
            </button>
          </div>
        </form>
      </div>
      <div className={`init_popup ${step === 1 ? 'active_popup' : ''}`}>
        <div className="active_popup_wrap">
          <div className="active_popup_wrap_content">
            <h2> Select Program</h2>
            <div className="active_popup_wrap_content_btn">
              {programs?.map((program, index) => (
                <button
                  className="content-btn"
                  key={`${index}-${program.name}-${program.id}`}
                  onClick={() => {
                    setNewProgram({ id: program.id, name: program.name });
                    setStep(2);
                  }}
                >
                  {program.name}
                </button>
              ))}
            </div>
          </div>
          <div className="active_popup_wrap_btn">
            <button
              className="popup_btn"
              onClick={() => {
                setStep(0);
              }}
            >
              Back
            </button>
            <button
              className="popup_btn"
              onClick={() => {
                setIsCreate(false);
                setChange(Math.random());
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
      <div className={`init_popup ${step === 2 ? 'active_popup' : ''}`}>
        <div className="active_popup_wrap">
          <div className="active_popup_wrap_content">
            <h2> Select Period</h2>
            <div className="active_popup_wrap_content_btn">
              {period?.map((period, index) => (
                <button
                  className="content-btn"
                  key={`${index}-${period.name}-${period.id}`}
                  onClick={() => {
                    setNewPeriod({ id: period.id, name: period.name });
                    setStep(3);
                  }}
                >
                  {period.name}
                </button>
              ))}
            </div>
          </div>
          <div className="active_popup_wrap_btn">
            <button
              className="popup_btn"
              onClick={() => {
                setStep(1);
              }}
            >
              Back
            </button>
            <button className="popup_btn ">Cancel</button>
          </div>
        </div>
      </div>
      <div className={`init_popup ${step === 3 ? 'active_popup' : ''}`}>
        <div className="active_popup_wrap">
          <div className="active_popup_wrap_content">
            <h2> Select Period</h2>
            <div className="active_popup_wrap_content_btn">
              <button className="content-btn" onClick={handleGenerateNewCourse}>
                Create New
              </button>
              <button
                className="content-btn"
                onClick={() => {
                  setStep(4);
                }}
              >
                Select Cohort
              </button>
            </div>
          </div>
          <div className="active_popup_wrap_btn">
            <button
              className="popup_btn "
              onClick={() => {
                setStep(2);
              }}
            >
              Back
            </button>
            <button
              className="popup_btn "
              onClick={() => {
                setIsCreate(false);
                setChange(Math.random());
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
      <div className={`init_popup ${step === 4 ? 'active_popup' : ''}`}>
        <div className="active_popup_wrap">
          <div className="active_popup_wrap_content">
            <h2>Select Cohort</h2>
            <div className="active_popup_wrap_content_btn">
              {recentCohorts &&
                recentCohorts.map((obj) => (
                  <button
                    className="content-btn"
                    onClick={() => {
                      console.log(obj.cohortId);
                      handleGenerateImportCourse(obj.cohortId);
                    }}
                  >
                    {obj.cohortName}{' '}
                  </button>
                ))}
            </div>
            <div className="active_popup_wrap_btn">
              <button
                className="popup_btn"
                onClick={() => {
                  setStep(3);
                }}
              >
                Back
              </button>
              <button
                className="popup_btn"
                onClick={() => {
                  setIsCreate(false);
                  setChange(Math.random());
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
