import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { GetInstructorResponse } from '../../../shared/models/responses/getInstructorResponse';
import Image from 'next/image';

import './InstructorDetail.scss';
import usePrograms from '@/app/hooks/programs/usePrograms';
import { Plus } from 'lucide-react';
import useDays from '@/app/hooks/programs/useDays';
import usePeriod from '@/app/hooks/programs/usePeriod';
import { PostNotificationRequest } from '../../../shared/models/requests/postNotificationRequest';
import { createNotification } from '@/app/actions/notifications';
import { GetDaysResponse } from '../../../shared/models/responses/getDaysResponse';
import { GetPeriodsResponse } from '../../../shared/models/responses/getPeriodsResponse';
import { Course } from '@/type/programs';
import useNotificationSender from '@/app/hooks/notifications/useNotificationSender';
import { getAccessToken } from '@/app/actions/common';
import { useCurrentUserContext } from '@/app/contexts/CurrentUserContext';
import useManagerId from '@/app/hooks/instructors/useManagerId';

const BASE_CLASS = 'instructorcard';
const BTN_BASE_CLASS = 'instructors_btn';

type Props = {
  instructor: GetInstructorResponse;
  fetchInstructor: (id: string) => void;
  setIsEdit: Dispatch<SetStateAction<boolean>>;
};

type PopupProgram = {
  name: string;
  course: Course;
};

export default function InstructorDetailEdit({ instructor, fetchInstructor, setIsEdit }: Props) {
  //Base Data
  const [userPrograms, setPrograms] = useState<string[]>();
  const { programs } = usePrograms();
  const { days } = useDays();
  const { period } = usePeriod();
  const { notiListSender, fetchNotiListSender } = useNotificationSender(instructor.id);
  //error Message
  const [message, setMessage] = useState<string>('');
  //popup State
  const [coursePopup, setCoursePopup] = useState<boolean>(false);
  const [daysPopup, setDaysPopup] = useState<boolean>(false);
  const [priodPopup, setPeriodPopup] = useState<boolean>(false);
  //popup List
  const [popupDaysList, setPopupDaysList] = useState<GetDaysResponse[]>();
  const [popupPeriodList, setPopupPeriodList] = useState<GetPeriodsResponse[]>();
  const [popupCoursesList, setPopupCoursesList] = useState<PopupProgram[]>();
  //avatar
  const [avatar, setAvatar] = useState<string>(instructor.avatarUrl);
  //user info
  const { receiverId } = useManagerId();
  const { currentUser } = useCurrentUserContext();
  const isManager = currentUser?.role === 'manager';
  const instructorsCourses = instructor.courses.filter((item, pos) => {
    return instructor.courses.map((course) => course.name).indexOf(item.name) === pos;
  });

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
  }, [days, instructor]);
  //set programs without instructor programs
  useEffect(() => {
    if (!programs) {
      return;
    }
    const tmpProgram: PopupProgram[] = [];
    programs.forEach((program) => {
      program.courses.forEach((course) => {
        if (!instructor.courses.some((obj) => course.name === 'Break' || obj.name === course.name)) {
          tmpProgram.push({ name: program.name, course: course });
        }
      });
    });
    setPopupCoursesList(tmpProgram);
  }, [programs, instructor]);
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
  }, [period, instructor]);

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

  const deleteUseCapability = async ({ id, type }: { id: string; type: string }) => {
    const deleteOptions = {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
        'Content-Type': 'application/json',
      },
    };
    try {
      switch (type) {
        case 'vacation':
          await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL_C}/userDayoffs/${id}`, deleteOptions);
          break;
        case 'day':
          await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL_C}/userCapabilityDays/${id}`, deleteOptions);
          break;
        case 'time':
          await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL_C}/userCapabilityTimes/${id}`, deleteOptions);
          break;
        case 'course':
          await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL_C}/userCapabilityCourses/${id}`, deleteOptions);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      fetchInstructor(instructor.id);
    }
  };

  const handleAddCourse = async (courseId: string, name: string) => {
    if (instructor.courses.some((item) => item.name === name)) {
      setMessage('the course is already exist');
    } else {
      try {
        const body = {
          courseId: courseId,
          userId: instructor.id,
          isDraft: isManager ? false : true,
        };

        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getAccessToken()}`,
          },
          body: JSON.stringify(body),
        };

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL_A}/userCapabilityCourses`, options);
        const { data } = await response.json();
        const userCapabilityCourseId = data.userCapabilityCourseId;
        if (isManager) {
          fetchInstructor(instructor.id);
        } else {
          const newNoti: PostNotificationRequest = {
            senderId: instructor.id,
            title: 'Add Course',
            type: 'course',
            receiverId: receiverId,
            userCapabilityCourseId: userCapabilityCourseId,
          };
          if (receiverId && userCapabilityCourseId) {
            const success = await createNotification(newNoti);
            if (success) {
              setMessage('The Course will be added after approve from manager');
              fetchNotiListSender();
            }
          }
        }
      } catch (error) {
        setMessage(error as string);
      }
    }
    setCoursePopup(false);

    setTimeout(() => {
      setMessage('');
    }, 5000);
  };

  const handleAddPeriod = async (timeId: string, name: string) => {
    if (instructor.periods.some((item) => item.name === name)) {
      setMessage('the period is already exist');
    } else {
      try {
        const body = {
          timeId: timeId,
          userId: instructor.id,
          isDraft: isManager ? false : true,
        };

        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getAccessToken()}`,
          },
          body: JSON.stringify(body),
        };

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL_A}/userCapabilityTimes`, options);
        const { data } = await response.json();
        const userCapabilityTimeId = data.userCapabilityTimeId;
        if (isManager) {
          fetchInstructor(instructor.id);
        } else {
          if (receiverId && userCapabilityTimeId) {
            const newNoti: PostNotificationRequest = {
              senderId: instructor.id,
              title: 'Add Period',
              type: 'time',
              receiverId: receiverId,
              userCapabilityTimeId: userCapabilityTimeId,
            };
            const success = await createNotification(newNoti);
            if (success) {
              fetchNotiListSender();
              setMessage('The Period will be added after approve from manager');
            }
          }
        }
      } catch (error) {
        setMessage(error as string);
      }
    }
    setPeriodPopup(false);

    setTimeout(() => {
      setMessage('');
    }, 5000);
  };

  const handleAddDays = async (dayId: string, name: string) => {
    if (instructor.capabilities.some((item) => item.name === name)) {
      setMessage('It is selected same days');
    } else {
      try {
        const body = {
          dayId: dayId,
          userId: instructor.id,
          isDraft: isManager ? false : true,
        };

        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getAccessToken()}`,
          },
          body: JSON.stringify(body),
        };

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL_A}/userCapabilityDays`, options);
        const { data } = await response.json();
        const userCapabilityDayId = data.userCapabilityDayId;

        if (isManager) {
          fetchInstructor(instructor.id);
        } else {
          if (receiverId && userCapabilityDayId) {
            const newNoti: PostNotificationRequest = {
              senderId: instructor.id,
              title: 'Add Days',
              type: 'day',
              receiverId: receiverId,
              userCapabilityDayId: userCapabilityDayId,
            };

            const success = await createNotification(newNoti);
            if (success) {
              fetchNotiListSender();
              setMessage('The days will be added after approve from manager');
            }
          }
        }
      } catch (error) {
        setMessage(error as string);
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

    const userCapabilityCourseId = instructor.courses.find((course) => course.name === name)?.id || '';

    if (isManager) {
      await deleteUseCapability({ id: userCapabilityCourseId, type: 'course' });
      fetchInstructor(instructor.id);
      return;
    }

    const newNoti: PostNotificationRequest = {
      senderId: instructor.id,
      title: 'Delete Course',
      type: 'course',
      receiverId: receiverId,
      userCapabilityCourseId: userCapabilityCourseId,
      forDelete: true,
    };

    try {
      const success = await createNotification(newNoti);
      if (success) {
        fetchNotiListSender();
        setMessage('The Course will be deleted after approve from manager');
      }
    } catch (error) {
      setMessage(error as string);
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

    const userCapabilityTimeId = instructor.periods.find((period) => period.name === name)?.id || '';

    if (isManager) {
      await deleteUseCapability({ id: userCapabilityTimeId, type: 'time' });
      fetchInstructor(instructor.id);
      return;
    }

    const newNoti: PostNotificationRequest = {
      senderId: instructor.id,
      title: 'Delete Period',
      type: 'time',
      receiverId: receiverId,
      userCapabilityTimeId: userCapabilityTimeId,
      forDelete: true,
    };
    try {
      const success = await createNotification(newNoti);
      if (success) {
        fetchNotiListSender();
        setMessage('The Period will be deleted after approve from manager');
      }
    } catch (error) {
      setMessage(error as string);
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

    const userCapabilityDayId = instructor.capabilities.find((day) => day.name === name)?.id || '';

    if (isManager) {
      await deleteUseCapability({ id: userCapabilityDayId, type: 'day' });
      fetchInstructor(instructor.id);
      return;
    }

    const newNoti: PostNotificationRequest = {
      senderId: instructor.id,
      title: 'Delete Days',
      type: 'day',
      receiverId: receiverId,
      userCapabilityDayId: userCapabilityDayId,
      forDelete: true,
    };

    try {
      const success = await createNotification(newNoti);
      if (success) {
        fetchNotiListSender();
        setMessage('The days will be deleted after approve from manager');
      }
    } catch (error) {
      setMessage(error as string);
    }

    setDaysPopup(false);

    setTimeout(() => {
      setMessage('');
    }, 5000);
  };

  type UploadAvatarProps = {
    imageData: File;
    userId: string;
  };

  const handleUploadAvatar = async ({ imageData, userId }: UploadAvatarProps) => {
    if (imageData && userId) {
      try {
        const formData = new FormData();
        formData.append('file', imageData);

        const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL_A}/users/${userId}/avatar`;

        const options = {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
          },
          body: formData,
        };

        await fetch(baseUrl, options);

        const avatarUrl = URL.createObjectURL(imageData);
        setAvatar(avatarUrl);
        setMessage('Avatar upload takes a minute. Please wait.');
      } catch (error) {
        setMessage('Failed to upload avatar');
      }

      setTimeout(() => {
        setMessage('');
      }, 5000);
    }
  };

  return (
    <>
      {instructor && (
        <ul className={`${BASE_CLASS} edit`}>
          <button
            className={`${BTN_BASE_CLASS}_finishedit`}
            type="button"
            onClick={() => {
              setIsEdit(false);
            }}
          >
            Finish Edit
          </button>
          <div className="message">{message}</div>
          <div className={`${BASE_CLASS}_title`} key={instructor.id + 'title'}>
            <button
              type="button"
              className="upload"
              onClick={() => {
                (document.getElementById(`fileInput${instructor.id}`) as HTMLInputElement).click();
              }}
            >
              {avatar == '' ? (
                <Image src="/imgs/user-round.png" alt="avatar" width={70} height={70} />
              ) : (
                <Image src={instructor.avatarUrl} alt="avatar" width={70} height={70} />
              )}
            </button>
            <input
              id={`fileInput${instructor.id}`}
              type="file"
              accept="image/*"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                e.target.files && handleUploadAvatar({ imageData: e.target.files[0], userId: instructor.id });
              }}
              style={{ display: 'none' }}
            />
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
                  className={`${BTN_BASE_CLASS}_period`}
                  key={`${period}-${index}`}
                  onClick={() => {
                    handleDeletePeriod(period.name);
                  }}
                  disabled={
                    notiListSender?.some((noti) => noti.isRead === false && noti.userCapabilityTimeId === period.id) ||
                    false
                  }
                >
                  {period.name}
                </button>
              ))}
              <button
                className={`${BTN_BASE_CLASS}_add`}
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
                  className={`${BTN_BASE_CLASS}_days`}
                  type="button"
                  key={`${day.name}-${index}-${instructor.id}`}
                  onClick={() => {
                    handleDeleteDays(day.name);
                  }}
                  disabled={
                    notiListSender?.some((noti) => noti.isRead === false && noti.userCapabilityDayId === day.id) ||
                    false
                  }
                >
                  {day.name}
                </button>
              ))}
              <button
                className={`${BTN_BASE_CLASS}_add`}
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
                  {instructorsCourses.map((course, index) =>
                    course.program.name === program ? (
                      <button
                        className={`${BTN_BASE_CLASS}_course`}
                        key={`${index}-${course.color}-${course.program}`}
                        onClick={() => {
                          handleDeleteCourse(course.name);
                        }}
                        disabled={
                          notiListSender?.some(
                            (noti) => noti.isRead === false && noti.userCapabilityCourseId === course.id
                          ) || false
                        }
                      >
                        {course.name}
                      </button>
                    ) : null
                  )}
                  <button
                    className={`${BTN_BASE_CLASS}_add`}
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
              popupCoursesList.map((course, index) =>
                notiListSender?.some(
                  (noti) =>
                    noti.isRead === false &&
                    noti.userCapabilityCourse &&
                    noti.userCapabilityCourse.courseId === course.course.id
                ) ? null : (
                  <button
                    key={`${index}-${course.course.name}-${course.course.id}`}
                    onClick={() => {
                      handleAddCourse(course.course.id, course.course.name);
                    }}
                    className={`${course.course.color} ${BTN_BASE_CLASS}_popup`}
                  >
                    {course.name} : {course.course.name}
                  </button>
                )
              )}
            <button className={`${BTN_BASE_CLASS}_add`} type="button" onClick={() => setCoursePopup(false)}>
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
                popupPeriodList.map((period, index) =>
                  notiListSender?.some(
                    (noti) =>
                      noti.isRead === false && noti.userCapabilityTime && noti.userCapabilityTime.timeId === period.id
                  ) ? null : (
                    <button
                      key={`${period.id}-${index}-${period.name}`}
                      onClick={() => {
                        handleAddPeriod(period.id, period.name);
                      }}
                      className={`${period.name} ${BTN_BASE_CLASS}_popup`}
                    >
                      {period.name}
                    </button>
                  )
                )}
              <button className={`${BTN_BASE_CLASS}_add`} type="button" onClick={() => setPeriodPopup(false)}>
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
                popupDaysList.map((day, index) =>
                  notiListSender?.some(
                    (noti) => noti.isRead === false && noti.userCapabilityDay && noti.userCapabilityDay.dayId === day.id
                  ) ? null : (
                    <button
                      key={`${day.id}-${index}-${day.name}`}
                      onClick={() => {
                        handleAddDays(day.id, day.name);
                      }}
                      className={`${day.name} ${BTN_BASE_CLASS}_popup`}
                    >
                      {day.name}
                    </button>
                  )
                )}
              <button className={`${BTN_BASE_CLASS}_add`} type="button" onClick={() => setDaysPopup(false)}>
                Close
              </button>
            </div>
          </li>
        </div>
      </div>
    </>
  );
}
