'use client';

import { toggleDeleteSchedule } from '@/type/cohorts';
import { Course } from '../../../shared/models/responses/getCohortResponse';
import { deleteSchedule } from '@/app/actions/cohorts';
import { useState } from 'react';
type Props = {
  course: Course;
  toggleDeleteSchedule: toggleDeleteSchedule;
};

const BTN_BASE_CLASS = 'cohort_btn';
const BASE_CLASS = 'cohort_table_content';
export default function CourseRowDelete({ course, toggleDeleteSchedule }: Props) {
  const [isToast, setIsToast] = useState<boolean>(false);
  const [toast, setToast] = useState<string>('');

  const handleDeleteSchedule = async (id: string) => {
    try {
      const success = await deleteSchedule(id);
      if (success) {
        toggleDeleteSchedule(course.scheduleId);
      }
    } catch (error: any) {
      setToast('the course can not delete');
      setIsToast(true);
      setTimeout(() => {
        setToast('');
        setIsToast(false);
      }, 5000);
    }
  };

  return (
    <>
      <div className={`${BASE_CLASS}_delete`}>
        <div className="">Are you sure you want to delete {course.name}?</div>
        <button
          type="button"
          className={`${BTN_BASE_CLASS}_del`}
          onClick={() => toggleDeleteSchedule(course.scheduleId)}
        >
          Cancel
        </button>
        <button
          type="button"
          className={`${BTN_BASE_CLASS}_del`}
          onClick={() => handleDeleteSchedule(course.scheduleId)}
        >
          Delete
        </button>
      </div>
      <div className={`${BASE_CLASS}_btn`}></div>
      <div className={`toast_init_popup ${isToast ? 'toast' : ''}`}>
        <div className="toast_wrap">{toast}</div>
      </div>
    </>
  );
}
