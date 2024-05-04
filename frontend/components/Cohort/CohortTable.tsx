import { Plus } from 'lucide-react';
import { Course, GetCohortResponse } from '../../../shared/models/responses/getCohortResponse';

import { Dispatch, SetStateAction, useState } from 'react';
import CourseRowEdit from './CourseRowEdit';
import CourseRowShow from './CourseRowShow';
import CohortRowAssign from './CohortRowAssign';
import CourseRowDelete from './CourseRowDelete';

const BASE_CLASS = 'cohort';

type Props = {
  cohort: GetCohortResponse;
  isEdit: boolean;
  setChange: Dispatch<SetStateAction<number>>;
};

export default function CohortTable({ cohort, isEdit, setChange }: Props) {
  const [assignScheduleId, setAssignScheduleId] = useState('');
  const [editScheduleId, setEditScheduleId] = useState('');
  const [deleteScheduleId, setDeleteScheduleId] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isScheduleEdit, setIsScheduleEdit] = useState(false);

  const toggleSelectedSchedule = (course: Course) => {
    if (course.status == 'upcoming' || course.status == 'ongoing') {
      if (assignScheduleId === '' || assignScheduleId != course.scheduleId) {
        setAssignScheduleId(course.scheduleId);
      } else {
        setAssignScheduleId('');
      }
    }
  };
  const toggleEditSchedule = (id: string) => {
    if (isScheduleEdit) {
      setIsScheduleEdit(false);
      setEditScheduleId('');
    } else {
      setIsScheduleEdit(true);
      setEditScheduleId(id);
    }
  };
  const toggleDeleteSchedule = (id: string) => {
    if (isDeleting) {
      setIsDeleting(false);
      setDeleteScheduleId('');
    } else {
      setIsDeleting(true);
      setDeleteScheduleId(id);
    }
  };

  return (
    <>
      <ul className={`${BASE_CLASS}_table`}>
        <li className={`${BASE_CLASS}_table_header`}>
          <div className={`${BASE_CLASS}_table_header_detail`}>
            <div>Start Date</div>
            <div>End Date</div>
            <div>Course</div>
            <div>Room</div>
            <div>Days</div>
            <div>Instructor</div>
          </div>
          <div className={`${BASE_CLASS}_table_header_btn`}></div>
        </li>
        {cohort.course.map((course, index) => (
          <>
            <li
              className={`${BASE_CLASS}_table_content`}
              key={`${course.name}-${course.scheduleId}-${index}`}
              onClick={() => toggleSelectedSchedule(course)}
            >
              {isEdit ? (
                <>
                  {isDeleting && course.scheduleId === deleteScheduleId ? (
                    <CourseRowDelete course={course} toggleDeleteSchedule={toggleDeleteSchedule} />
                  ) : (
                    <>
                      {isScheduleEdit ? (
                        <>
                          {editScheduleId === course.scheduleId ? (
                            <CourseRowEdit
                              course={course}
                              toggleEditSchedule={toggleEditSchedule}
                              setChange={setChange}
                            />
                          ) : (
                            <>
                              <CourseRowShow
                                course={course}
                                isEdit={isEdit}
                                isDeleting={isDeleting}
                                isScheduleEdit={isScheduleEdit}
                                toggleDeleteSchedule={toggleDeleteSchedule}
                                toggleEditSchedule={toggleEditSchedule}
                              />
                            </>
                          )}
                        </>
                      ) : (
                        <>
                          <CourseRowShow
                            course={course}
                            isEdit={isEdit}
                            isDeleting={isDeleting}
                            isScheduleEdit={isScheduleEdit}
                            toggleDeleteSchedule={toggleDeleteSchedule}
                            toggleEditSchedule={toggleEditSchedule}
                          />
                        </>
                      )}
                    </>
                  )}
                </>
              ) : (
                <CourseRowShow
                  course={course}
                  isEdit={isEdit}
                  isDeleting={isDeleting}
                  isScheduleEdit={isScheduleEdit}
                  toggleDeleteSchedule={toggleDeleteSchedule}
                  toggleEditSchedule={toggleEditSchedule}
                />
              )}
            </li>
            {assignScheduleId === course.scheduleId && !isEdit && (
              <>
                <CohortRowAssign course={course} setChange={setChange} /> <div className={`${BASE_CLASS}_btn`}></div>
              </>
            )}
          </>
        ))}

        {isEdit ? (
          <li className={`${BASE_CLASS}_table_content`}>
            <div className={`${BASE_CLASS}_table_content_add`}>
              <button>
                <Plus size={15} />
              </button>
            </div>
            <div className={`${BASE_CLASS}_table_content_btn`}></div>
          </li>
        ) : (
          <></>
        )}
      </ul>
    </>
  );
}
