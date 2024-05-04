import { Pencil, Trash2 } from 'lucide-react';
import { Course } from '../../../shared/models/responses/getCohortResponse';
import { changeDate } from '@/app/actions/common';
import { toggleDeleteSchedule, toggleEditSchedule } from '@/type/cohorts';
type Props = {
  course: Course;

  isEdit: boolean;
  isDeleting: boolean;
  isScheduleEdit: boolean;
  toggleDeleteSchedule: toggleDeleteSchedule;
  toggleEditSchedule: toggleEditSchedule;
};

const BASE_CLASS = 'cohort_table_content_show';
export default function CourseRowShow({
  course,

  isEdit,
  isDeleting,
  isScheduleEdit,
  toggleDeleteSchedule,
  toggleEditSchedule,
}: Props) {
  return (
    <>
      <div className={`${BASE_CLASS}`}>
        <div className={`${BASE_CLASS}_row`}>
          <div className={`${BASE_CLASS}_row_detail ${course.status}`}>
            <div>{changeDate(course.startDate)}</div>
            <div>{changeDate(course.endDate)}</div>
            <div>
              {course.name} - {course.currentHour}/{course.courseHour}
            </div>
            <div>{course.room}</div>
            <div>{course.days}</div>
            <div>{course.instructor}</div>
          </div>
          <div className={`${BASE_CLASS}_row_btn`}>
            {isEdit && !isScheduleEdit && !isDeleting && (
              <>
                {(course.status === 'upcoming' || course.status === 'ongoing') && (
                  <>
                    <button className="edit" onClick={() => toggleEditSchedule(course.scheduleId)}>
                      <Pencil size={20} />
                    </button>
                    <button className="del" onClick={() => toggleDeleteSchedule(course.scheduleId)}>
                      <Trash2 size={20} />
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
