'use client';
import { createCohort, getCohortById, getRecentCohortByProgram } from '@/app/actions/cohorts';
import { changeDate } from '@/app/actions/common';
import useDays from '@/app/hooks/programs/useDays';
import usePeriod from '@/app/hooks/programs/usePeriod';
import usePrograms from '@/app/hooks/programs/usePrograms';
import useSchoolBreak from '@/app/hooks/schoolbreak/useSchoolBreak';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import { PostCohortRequest, Schedule } from '../../../shared/models/requests/postCohortRequest';
import { GetCohortResponse } from '../../../shared/models/responses/getCohortResponse';
import { GetRecentCohortResponse } from '../../../shared/models/responses/getRecentCohortResponse';
import { GetSchoolBreaksResponse } from '../../../shared/models/responses/getSchoolBreaksResponse';
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
  const { breaks, fetchBreaks } = useSchoolBreak();
  //Error Message
  const [isToast, setIsToast] = useState<boolean>(false);
  const [toast, setToast] = useState<string>('');

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
  const [isImport, setIsImport] = useState<boolean>(false);
  //to update Date and Period
  const [index, setIndex] = useState<number>(0);
  const [isCalandar, setIsCalandar] = useState<boolean>(false);
  const [isDays, setIsDays] = useState<boolean>(false);
  const [sort, setSort] = useState<number>(0);
  const [rangeComplete, setRangeComplete] = useState<number>(0);

  // To get Estimate EndDate
  const [cohortStartDate, setCohortStartDate] = useState<Date>();
  const [estimateDate, setEstimateDate] = useState<Date>();
  const [programHour, setProgramHour] = useState<number>(0);
  const [schoolBreaksRange, setSchoolBreakRange] = useState<GetSchoolBreaksResponse[]>();

  const fetchRecentData = async () => {
    try {
      if (!newProgram?.id) {
        return;
      }
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
    setStep(0);
    console.log(step);
  }, []);

  //import cohort
  useEffect(() => {
    if (!importCohort) {
      return;
    }
    const tmpCourse: Course[] = [];

    importCohort.course.forEach((course, index) => {
      if (index === 0) {
        setCohortStartDate(new Date(course.startDate));
      }
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
    });

    setIsImport(true);
    setNewCourses(tmpCourse);
    setStep(100);
  }, [importCohort]);

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
  }, [sort]);

  //set Cohort Start Date
  useEffect(() => {
    if (cohortStartDate) {
      // -3 to set EndDate on Friday
      var programDay = (7 * (programHour / 20) - 2) * 1000 * 60 * 60 * 24;
      var tmpEstimateDate = new Date(cohortStartDate.getTime() + programDay);
      setEstimateDate(tmpEstimateDate);
      setRangeComplete(Math.random());
    }
  }, [cohortStartDate]);
  //set Break
  useEffect(() => {
    if (!breaks || !cohortStartDate || !estimateDate) return;
    const filteredBreaks = breaks.filter((breakItem) => {
      const startDate = new Date(breakItem.startDate);
      return startDate >= cohortStartDate && startDate <= estimateDate;
    });

    console.log(filteredBreaks);
    if (filteredBreaks.length === 0) return;

    let totalBreakDuration: number = 0;
    filteredBreaks.forEach((breakItem) => {
      const breakStartDate = new Date(breakItem.startDate);
      const breakEndDate = new Date(breakItem.endDate);
      const breakDuration = breakEndDate.getTime() - breakStartDate.getTime();
      totalBreakDuration += breakDuration;
    });
    const threeDaysInMilliseconds: number = 3 * 24 * 60 * 60 * 1000;
    totalBreakDuration += threeDaysInMilliseconds;

    const adjustedEstimateDate = new Date(estimateDate.getTime() + totalBreakDuration);
    console.log(adjustedEstimateDate);

    setEstimateDate(adjustedEstimateDate);
    setSchoolBreakRange(filteredBreaks);
  }, [rangeComplete]);

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
  }, [newCohort]);

  const handleStepOne = (formData: any) => {
    if (!newPeriod.id || !newProgram.id) return;
    setNewCohort(formData.get('Cohort'));
    setStep(1);
  };

  const handleGenerateNewCourse = () => {
    const tmpCourse: Course[] = [];

    //add school break Range
    if (schoolBreaksRange) {
      //get Break Id
      let breakId = '';
      programs?.forEach((program) => {
        if (program.id === newProgram.id) {
          const breakCourse = program.courses.find((course) => course.name === 'Break');
          if (breakCourse) {
            breakId = breakCourse.id;
          }
        }
      });
      schoolBreaksRange.forEach((breaks) => {
        tmpCourse.push({
          startDate: new Date(`${breaks.startDate}T00:00:00-07:00`),
          endDate: new Date(`${breaks.endDate}T00:00:00-07:00`),
          courseId: breakId,
          courseName: 'Break',
          dayId: newDay.id,
          dayName: newDay.name,
          hour: 0,
          currenthour: null,
        });
      });
    }
    programs?.forEach((program) => {
      if (program.id === newProgram.id) {
        program.courses.forEach((course) => {
          if (course.name != 'Break') {
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
          }
        });
      }
    });

    setNewCourses(tmpCourse);
    setStep(100);
  };

  const handleGenerateImportCourse = (id: string) => {
    fetchCohortData(id);
  };

  const updateStartDate = (event: any) => {
    setCohortStartDate(event);
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

      console.log(tmpStart, tmpEnd);
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
    const filteredBreakWithinRange = schoolBreaksRange?.some((breakItem) => {
      const breakStartDate = new Date(breakItem.startDate);
      const breakEndDate = new Date(breakItem.endDate);

      // Check if the break falls within the range of tmpStart and tmpEnd
      return (
        (breakStartDate >= tmpStart && breakStartDate <= tmpEnd) ||
        (breakEndDate >= tmpStart && breakEndDate <= tmpEnd) ||
        (tmpStart >= breakStartDate && tmpEnd <= breakEndDate)
      );
    });

    let totalBreakDuration = 0;
    if (filteredBreakWithinRange) {
      schoolBreaksRange?.forEach((breakItem) => {
        const breakStartDate = new Date(breakItem.startDate);
        const breakEndDate = new Date(breakItem.endDate);
        const breakDuration = breakEndDate.getTime() - breakStartDate.getTime();
        totalBreakDuration += breakDuration;
      });
      const threeDaysInMilliseconds: number = 3 * 24 * 60 * 60 * 1000;
      totalBreakDuration += threeDaysInMilliseconds;

      tmpEnd = new Date(tmpEnd.getTime() + totalBreakDuration);
    }

    tmpCourse[index] = { ...tmpCourse[index], startDate: tmpStart, endDate: tmpEnd, currenthour: currenthour };

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

      // Check and add  School Break range
      const filteredBreakWithinRange = schoolBreaksRange?.some((breakItem) => {
        const breakStartDate = new Date(breakItem.startDate);
        const breakEndDate = new Date(breakItem.endDate);

        // Check if the break falls within the range of tmpStart and tmpEnd
        return (
          (tmpStart && breakStartDate >= tmpStart && breakStartDate <= tmpEnd) ||
          (tmpStart && breakEndDate >= tmpStart && breakEndDate <= tmpEnd) ||
          (tmpStart && tmpStart >= breakStartDate && tmpEnd <= breakEndDate)
        );
      });

      let totalBreakDuration = 0;
      if (filteredBreakWithinRange) {
        schoolBreaksRange?.forEach((breakItem) => {
          const breakStartDate = new Date(breakItem.startDate);
          const breakEndDate = new Date(breakItem.endDate);
          const breakDuration = breakEndDate.getTime() - breakStartDate.getTime();
          totalBreakDuration += breakDuration;
        });
        const threeDaysInMilliseconds: number = 3 * 24 * 60 * 60 * 1000;
        totalBreakDuration += threeDaysInMilliseconds;

        tmpEnd = new Date(tmpEnd.getTime() + totalBreakDuration);
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

    setNewCourses(tmpCourse);
    setIsDays(false);
  };

  const handleCreateCohort = async (formData: any) => {
    if (!newCourses) {
      return;
    }
    var today = new Date();
    if (newCourses[0].startDate && newCourses[0].startDate < today) {
      setToast('Please Check Start Date. It can not select past day');
      setIsToast(true);
      setTimeout(() => {
        setToast('');
        setIsToast(false);
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
      setToast('Please Select Schedule Date');
      setIsToast(true);
      setTimeout(() => {
        setToast('');
        setIsToast(false);
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

      if (schoolBreaksRange) {
        for (const breaks of schoolBreaksRange) {
          const startDate = new Date(breaks.startDate);
          const endDate = new Date(breaks.endDate);
          if (date >= startDate && date <= endDate) {
            return true; // Disable dates within school breaks
          }
        }
      }
    }
    return false;
  };
  return (
    <div className={BASE_CLASS}>
      <div className={`${BASE_CLASS}_header`}>
        <h2>
          Create New Course{' '}
          <button
            type="button"
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
          <div> Cohort Start Date : {cohortStartDate && changeDate(cohortStartDate)}</div>
          <div> Estimate End Date : {estimateDate && changeDate(estimateDate)}</div>
        </div>
      </div>
      <div className={`${BASE_CLASS}_courses`}>
        <li>
          <h4>Date</h4>
          <h4>Course</h4>
          <h4>Day</h4>
        </li>
        {isImport ? (
          <>
            {newCourses &&
              newCourses.map((course, index) => (
                <li key={`${index}-${course.courseId}-${course.courseName}`}>
                  <div>
                    <span className="startdate">{course.startDate && changeDate(course.startDate)} </span>-{' '}
                    <span className="enddate">{course.endDate && changeDate(course.endDate)}</span>
                  </div>

                  <label>
                    {course.courseName} - {course.currenthour && course.currenthour}/ {course.hour}h
                  </label>

                  <div>{course.dayName}</div>
                </li>
              ))}
          </>
        ) : (
          <>
            {newCourses &&
              newCourses.map((course, index) => (
                <li key={`${index}-${course.courseId}-${course.courseName}`}>
                  {course.courseName === 'Break' ? (
                    <div>
                      <span className="startdate">{course.startDate && changeDate(course.startDate)} </span>-{' '}
                      <span className="enddate">{course.endDate && changeDate(course.endDate)}</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className={`${BASE_CLASS}_date`}
                      onClick={() => {
                        setIsCalandar(true);
                        setIndex(index);
                      }}
                    >
                      <span className="startdate">{course.startDate && changeDate(course.startDate)} </span>-{' '}
                      <span className="enddate">{course.endDate && changeDate(course.endDate)}</span>
                    </button>
                  )}

                  <label>
                    {course.courseName} - {course.currenthour && course.currenthour}/ {course.hour}h
                  </label>
                  {course.courseName === 'Break' ? (
                    <div>{course.dayName}</div>
                  ) : (
                    <button
                      type="button"
                      className={`${BASE_CLASS}_date`}
                      onClick={() => {
                        setIsDays(true);
                        setIndex(index);
                      }}
                    >
                      {course.dayName}
                    </button>
                  )}
                </li>
              ))}
          </>
        )}
      </div>
      <div>
        <button type="button" className={`${BASE_CLASS}_save`} onClick={handleCreateCohort}>
          Save
        </button>
        <button
          type="button"
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
          <Calendar onChange={updateDate} minDate={cohortStartDate} selectRange={false} tileDisabled={tileDisabled} />
          <button type="button" className="close" onClick={() => setIsCalandar(false)}>
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
                  type="button"
                  key={obj.id}
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
            <button type="button" className="popup_btn" onClick={() => setIsDays(false)}>
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
          <div className="active_popup_wrap_content_btn">
            {programs?.map((program, index) => (
              <button
                type="button"
                className={`${program.id === newProgram.id ? 'program-selected' : `program-btn`}`}
                key={`${index}-${program.name}-${program.id}`}
                onClick={() => {
                  setNewProgram({ id: program.id, name: program.name });
                }}
              >
                {program.name}
              </button>
            ))}
          </div>
          <div className="active_popup_wrap_content_btn">
            {period?.map((period, index) => (
              <button
                type="button"
                className={`${period.id === newPeriod.id ? 'period-selected' : `period-btn`}`}
                key={`${index}-${period.name}-${period.id}`}
                onClick={() => {
                  setNewPeriod({ id: period.id, name: period.name });
                }}
              >
                {period.name}
              </button>
            ))}
          </div>
          <div className="active_popup_wrap_btn">
            <button
              type="button"
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
            <div className="active_popup_wrap_content_btn">
              <button
                type="button"
                className="program-btn"
                onClick={() => {
                  setStep(2);
                }}
              >
                Create New
              </button>
              <button
                type="button"
                className="program-btn"
                onClick={() => {
                  setStep(3);
                }}
              >
                Select Cohort
              </button>
            </div>
          </div>
          <div className="active_popup_wrap_btn">
            <button
              type="button"
              className="popup_btn "
              onClick={() => {
                setStep(0);
              }}
            >
              Back
            </button>
            <button
              type="button"
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
      <div className={`init_popup ${step === 2 ? 'active_popup' : ''}`}>
        <div className="active_popup_wrap">
          <div className="active_popup_wrap_content">
            <h2>Select Start Date</h2>
            <Calendar onChange={updateStartDate} minDate={new Date()} tileDisabled={tileDisabled} selectRange={false} />
          </div>
          <div className="active_popup_wrap_btn">
            <button
              type="button"
              className="popup_btn"
              onClick={() => {
                setStep(3);
              }}
            >
              Back
            </button>
            <button type="button" className="popup_btn" onClick={handleGenerateNewCourse}>
              Start
            </button>
          </div>
        </div>
      </div>
      <div className={`init_popup ${step === 3 ? 'active_popup' : ''}`}>
        <div className="active_popup_wrap">
          <div className="active_popup_wrap_content">
            <h2>Select Cohort</h2>
            <div className="active_popup_wrap_content_btn">
              {recentCohorts &&
                recentCohorts.map((obj) => (
                  <button
                    type="button"
                    className="program-btn"
                    key={obj.cohortId}
                    onClick={() => {
                      handleGenerateImportCourse(obj.cohortId);
                    }}
                  >
                    {obj.cohortName}{' '}
                  </button>
                ))}
            </div>
            <div className="active_popup_wrap_btn">
              <button
                type="button"
                className="popup_btn"
                onClick={() => {
                  setStep(1);
                }}
              >
                Back
              </button>
              <button
                type="button"
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
      <div className={`toast_init_popup ${isToast ? 'toast' : ''}`}>
        <div className="toast_wrap">{toast}</div>
      </div>
    </div>
  );
}
