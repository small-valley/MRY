import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { GetInstructorResponse } from '../../../shared/models/responses/getInstructorResponse';
import Image from 'next/image';

import './InstructorDetail.scss';
import usePrograms from '@/app/hooks/programs/usePrograms';
import { Plus } from 'lucide-react';
import useDays from '@/app/hooks/programs/useDays';
import usePeriod from '@/app/hooks/programs/usePeriod';
import { PostNotificationRequest } from '../../../shared/models/requests/postNotificationRequest';
import { createNotification, getNotificationBySender } from '@/app/actions/notifications';
import { GetDaysResponse } from '../../../shared/models/responses/getDaysResponse';
import { GetPeriodsResponse } from '../../../shared/models/responses/getPeriodsResponse';
import { Course } from '@/type/programs';
import useNotificationSender from '@/app/hooks/notifications/useNotificationSender';
const BASE_CLASS = 'instructorcard';

type Props = {
  instructor: GetInstructorResponse;
  setIsEdit: Dispatch<SetStateAction<boolean>>;
};

type PopupProgram = {
  name: string;
  course: Course;
};

export default function InstructorDetailEdit({ instructor, setIsEdit }: Props) {
  //Base Data
  const [userPrograms, setPrograms] = useState<string[]>();
  const { programs, fetchPrograms } = usePrograms();
  const { days, fetchDays } = useDays();
  const { period, fetchPeriod } = usePeriod();
  const { notiListSender, fetchNotiListSender } = useNotificationSender(instructor.id);
  //error Mesate
  const [message, setMessage] = useState<string>('');

  //popup State
  const [coursePopup, setCoursePopup] = useState<boolean>(false);
  const [daysPopup, setDaysPopup] = useState<boolean>(false);
  const [priodPopup, setPeriodPopup] = useState<boolean>(false);
  //popup List
  const [popupDaysList, setPopupDaysList] = useState<GetDaysResponse[]>();
  const [popupPeriodList, setPopupPeriodList] = useState<GetPeriodsResponse[]>();
  const [popupCoursesList, setPopupCoursesList] = useState<PopupProgram[]>();

  console.log(notiListSender);

  //set Days without instructor days
  useEffect(() => {
    if (!days) {
      return;
    }
    const tmpDays: GetDaysResponse[] = [];
    days.forEach((day) => {
      if (!instructor.capabilities.some((obj) => obj.name === day.name)) {
        tmpDays.push(day);
      }
    });
    setPopupDaysList(tmpDays);
  }, [days]);
  //set programs without instructor programs
  useEffect(() => {
    if (!programs) {
      return;
    }
    const tmpProgram: PopupProgram[] = [];
    programs.forEach((program) => {
      program.courses.forEach((course) => {
        if (!instructor.courses.some((obj) => obj.name === course.name)) {
          tmpProgram.push({ name: program.name, course: course });
        }
      });
    });
    setPopupCoursesList(tmpProgram);
  }, [programs]);
  //set period without instructor period
  useEffect(() => {
    if (!period) {
      return;
    }
    const tmpPeriod: GetPeriodsResponse[] = [];
    period.forEach((period) => {
      if (!instructor.periods.some((obj) => obj.name === period.name)) {
        tmpPeriod.push(period);
      }
    });
    setPopupPeriodList(tmpPeriod);
  }, [period]);

  //filtering program
  useEffect(() => {
    if (instructor) {
      const tmpProgram: string[] = [];
      instructor.courses
        .filter(
          (course, index, arr) => arr.findLastIndex((course2) => course2.program.name === course.program.name) === index
        )
        .forEach((course) => {
          tmpProgram.push(course.program.name);
        });
      setPrograms(tmpProgram);
    }
  }, [instructor]);

  const handleAddCourse = async (id: string, name: string) => {
    if (instructor.courses.some((item) => item.name === name)) {
      setMessage('the course is already exsist');
    } else {
      const newNoti: PostNotificationRequest = {
        senderId: instructor.id,
        title: 'Add Course',
        type: 'course',
        receiverId: 'f1d89aaa-b7b2-4f05-b32f-1f30345e0bd9',
        userCapabilityCourseId: id,
      };

      try {
        const success = await createNotification(newNoti);
        if (success) {
          setMessage('The Course will be added after approve from manager');
          fetchNotiListSender();
        }
      } catch (error: any) {
        console.log(error);
        setMessage(error);
      }
    }
    setCoursePopup(false);

    setTimeout(() => {
      setMessage('');
    }, 5000);
  };

  const handleAddPeriod = async (id: string, name: string) => {
    if (instructor.periods.some((item) => item.name === name)) {
      setMessage('the period is already exsist');
    } else {
      const newNoti: PostNotificationRequest = {
        senderId: instructor.id,
        title: 'Add Period',
        type: 'time',
        receiverId: 'f1d89aaa-b7b2-4f05-b32f-1f30345e0bd9',
        userCapabilityTimeId: id,
      };

      try {
        const success = await createNotification(newNoti);
        if (success) {
          fetchNotiListSender();
          setMessage('The Period will be added after approve from manager');
        }
      } catch (error: any) {
        setMessage(error);
      }
    }
    setPeriodPopup(false);

    setTimeout(() => {
      setMessage('');
    }, 5000);
  };

  const handleAddDays = async (id: string, name: string) => {
    if (instructor.capabilities.some((item) => item.name === name)) {
      setMessage('It is selected same days');
    } else {
      const newNoti: PostNotificationRequest = {
        senderId: instructor.id,
        title: 'Add Days',
        type: 'day',
        receiverId: 'f1d89aaa-b7b2-4f05-b32f-1f30345e0bd9',
        userCapabilityDayId: id,
      };

      try {
        const success = await createNotification(newNoti);
        if (success) {
          fetchNotiListSender();
          setMessage('The days will be added after approve from manager');
        }
      } catch (error: any) {
        setMessage(error);
      }
    }
    setDaysPopup(false);

    setTimeout(() => {
      setMessage('');
    }, 5000);
  };

  const handleDeleteCourse = async (name: string) => {
    if (!programs) {
      setMessage('Please Try again');
      setCoursePopup(false);
      setTimeout(() => {
        setMessage('');
      }, 5000);
      return;
    }
    const courseId: string[] = [];
    programs.forEach((program) => {
      program.courses.forEach((course) => {
        if (course.name === name) {
          courseId.push(course.id);
        }
      });
    });

    const newNoti: PostNotificationRequest = {
      senderId: instructor.id,
      title: 'Delete Course',
      type: 'course',
      receiverId: 'f1d89aaa-b7b2-4f05-b32f-1f30345e0bd9',
      userCapabilityCourseId: courseId[0],
    };

    try {
      const success = await createNotification(newNoti);
      if (success) {
        fetchNotiListSender();
        setMessage('The Course will be deleted after approve from manager');
      }
    } catch (error: any) {
      setMessage(error);
    }

    setCoursePopup(false);

    setTimeout(() => {
      setMessage('');
    }, 5000);
  };

  const handleDeletePeriod = async (name: string) => {
    if (!period) {
      setMessage('Please Try again');
      setPeriodPopup(false);
      setTimeout(() => {
        setMessage('');
      }, 5000);
      return;
    }

    const periodId = period.filter((item) => item.name === name).map((period) => period.id);
    const newNoti: PostNotificationRequest = {
      senderId: instructor.id,
      title: 'Delete Period',
      type: 'time',
      receiverId: 'f1d89aaa-b7b2-4f05-b32f-1f30345e0bd9',
      userCapabilityTimeId: periodId[0],
    };
    try {
      const success = await createNotification(newNoti);
      if (success) {
        fetchNotiListSender();
        setMessage('The Period will be deleted after approve from manager');
      }
    } catch (error: any) {
      setMessage(error);
    }

    setPeriodPopup(false);

    setTimeout(() => {
      setMessage('');
    }, 5000);
  };

  const handleDeleteDays = async (name: string) => {
    if (!days) {
      setMessage('Please Try again');
      setDaysPopup(false);
      setTimeout(() => {
        setMessage('');
      }, 5000);
      return;
    }
    const dayId = days.filter((item) => item.name === name).map((day) => day.id);

    const newNoti: PostNotificationRequest = {
      senderId: instructor.id,
      title: 'Delete Days',
      type: 'day',
      receiverId: 'f1d89aaa-b7b2-4f05-b32f-1f30345e0bd9',
      userCapabilityDayId: dayId[0],
    };

    try {
      const success = await createNotification(newNoti);
      if (success) {
        fetchNotiListSender();
        setMessage('The days will be deleted after approve from manager');
      }
    } catch (error: any) {
      setMessage(error);
    }

    setDaysPopup(false);

    setTimeout(() => {
      setMessage('');
    }, 5000);
  };

  return (
    <>
      {instructor && (
        <ul className={`${BASE_CLASS} edit`}>
          <button
            type="button"
            className="finishedit"
            onClick={() => {
              setIsEdit(false);
            }}
          >
            Finish Edit
          </button>
          <div className="message">{message}</div>
          <div className={`${BASE_CLASS}_title`} key={instructor.id + 'title'}>
            <button type="button" className="upload">
              {instructor.avatarUrl == '' ? (
                <Image src="/imgs/user-round.png" alt="avatar" width={70} height={70} />
              ) : (
                <Image src={instructor.avatarUrl} alt="avatar" width={70} height={70} />
              )}
            </button>
            <div className={`${BASE_CLASS}_title_detail`}>
              <h4>
                {instructor.firstName} {instructor.lastName}
              </h4>
              <div className={`${BASE_CLASS}_title_detail_status`}>
                <div>{instructor.isActive ? <p className="active">Active</p> : <p className="inActive">No</p>}</div>
                <div>
                  <p className="hours">{instructor.hourType}</p>
                </div>
              </div>
            </div>
          </div>
          <li className={`${BASE_CLASS}_period`} key={instructor.id + 'period'}>
            <div>Period</div>
            <div>
              {instructor.periods.map((period, index) => (
                <button
                  className={period.name}
                  key={`${period}-${index}`}
                  onClick={() => {
                    handleDeletePeriod(period.name);
                  }}
                >
                  {period.name}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  setPeriodPopup(true);
                }}
              >
                <Plus size={15} />
              </button>
            </div>
          </li>
          <li className={`${BASE_CLASS}_days`} key={instructor.id + 'days'}>
            <div>Days</div>
            <div>
              {instructor.capabilities.map((day, index) => (
                <button
                  type="button"
                  key={`${day.name}-${index}-${instructor.id}`}
                  onClick={() => {
                    handleDeleteDays(day.name);
                  }}
                >
                  {day.name}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  setDaysPopup(true);
                }}
              >
                <Plus size={15} />
              </button>
            </div>
          </li>
          {userPrograms &&
            userPrograms.map((program, index) => (
              <li className={`${BASE_CLASS}_course`} key={`${program}-${index}-${instructor.id}`}>
                <div className={`${BASE_CLASS}_course_program_title`}>{program} Courses</div>
                <div className={`${BASE_CLASS}_course_program_course`}>
                  {instructor.courses.map((course, index) =>
                    course.program.name === program ? (
                      <button
                        className={course.color}
                        key={`${index}-${course.color}-${course.program}`}
                        onClick={() => {
                          handleDeleteCourse(course.name);
                        }}
                      >
                        {course.name}
                      </button>
                    ) : (
                      <></>
                    )
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setCoursePopup(true);
                    }}
                  >
                    <Plus size={15} />
                  </button>
                </div>
              </li>
            ))}
        </ul>
      )}
      <div className={`init_popup ${coursePopup ? 'course_popup' : ''}`}>
        <div className="popup_wrap">
          <div>
            {popupCoursesList &&
              popupCoursesList.map((course, index) => (
                <button
                  key={`${index}-${course.course.name}-${course.course.id}`}
                  onClick={() => {
                    handleAddCourse(course.course.id, course.course.name);
                  }}
                  className={course.course.color}
                >
                  {course.name} : {course.course.name}
                </button>
              ))}
            <button type="button" onClick={() => setCoursePopup(false)}>
              Close
            </button>
          </div>
        </div>
      </div>
      <div className={`init_popup ${priodPopup ? 'period_popup' : ''}`}>
        <div className="popup_wrap">
          <li>
            <h3>Period</h3>
            <div>
              {popupPeriodList &&
                popupPeriodList.map((period, index) => (
                  <button
                    key={`${period.id}-${index}-${period.name}`}
                    onClick={() => {
                      handleAddPeriod(period.id, period.name);
                    }}
                    className={period.name}
                  >
                    {period.name}
                  </button>
                ))}
              <button type="button" onClick={() => setPeriodPopup(false)}>
                Close
              </button>
            </div>
          </li>
        </div>
      </div>
      <div className={`init_popup ${daysPopup ? 'days_popup' : ''}`}>
        <div className="popup_wrap">
          <li>
            <h3>Days</h3>
            <div>
              {popupDaysList &&
                popupDaysList.map((day, index) => (
                  <button
                    key={`${day.id}-${index}-${day.name}`}
                    onClick={() => {
                      handleAddDays(day.id, day.name);
                    }}
                    className={day.name}
                  >
                    {day.name}
                  </button>
                ))}
              <button type="button" onClick={() => setDaysPopup(false)}>
                Close
              </button>
            </div>
          </li>
        </div>
      </div>
    </>
  );
}
