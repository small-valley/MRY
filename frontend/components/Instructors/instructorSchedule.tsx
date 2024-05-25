import { InstructorSchedules } from '@/app/testdata';
import { GetInstructorResponse } from '../../../shared/models/responses/getInstructorResponse';
type Props = {
  instructor: GetInstructorResponse;
};

const BASE_CLASS = 'instructors_content_schedule_class_table';

export default function InstructorSchedule({ instructor }: Props) {
  return (
    <>
      <ul className={BASE_CLASS}>
        <li className={`${BASE_CLASS}_header`}>
          <div>Cohort</div>
          <div>Course</div>
          <div>Start</div>
          <div>End</div>
        </li>
        {InstructorSchedules.map((schedule) => (
          <li className={`${BASE_CLASS}_content ${schedule.status}`} key={schedule.name + schedule.cohort}>
            <div>{schedule.cohort}</div>
            <div>{schedule.name}</div>
            <div>{schedule.startDate}</div>
            <div>{schedule.endDate}</div>
          </li>
        ))}
      </ul>
    </>
  );
}
