import { toggleDeleteSchedule } from '@/type/cohorts';
import { Course } from '../../../shared/models/responses/getCohortResponse';
import { deleteSchedule } from '@/app/actions/cohorts';
type Props = {
  course: Course;
  toggleDeleteSchedule: toggleDeleteSchedule;
};

const BASE_CLASS = 'cohort_table_content';
export default function CourseRowDelete({ course, toggleDeleteSchedule }: Props) {
  const handleDeleteSchedule = async (id: string) => {
    const success = await deleteSchedule(id);
    if (success) {
      toggleDeleteSchedule(course.scheduleId);
    }
  };

  return (
    <>
      <div className={`${BASE_CLASS}_delete`}>
        <div className="">Are you sure you want to delete {course.name}?</div>
        <button onClick={() => toggleDeleteSchedule(course.scheduleId)}>Cancel</button>
        <button onClick={() => handleDeleteSchedule(course.scheduleId)}>Delete</button>
      </div>
      <div className={`${BASE_CLASS}_btn`}></div>
    </>
  );
}
