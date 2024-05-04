import Image from 'next/image';
import { GetInstructorResponse } from '../../../shared/models/responses/getInstructorResponse';
const BASE_CLASS = 'instructors_table_content';
type Props = {
  instructor: GetInstructorResponse;
};

export default function InstructorTableRow({ instructor }: Props) {
  const programs = instructor.courses
    .filter(
      (course, index, arr) => arr.findLastIndex((course2) => course2.program.name === course.program.name) === index
    )
    .map((course) => {
      return {
        program: course.program.name,
      };
    });

  return (
    <>
      <div className={`${BASE_CLASS}_instructor`}>
        {instructor.avatarUrl == '' ? (
          <Image src="/imgs/user-round.png" alt="avatar" width={35} height={35} />
        ) : (
          <Image src={instructor.avatarUrl} alt="avatar" width={35} height={35} />
        )}

        <div className={`${BASE_CLASS}_instructor_detail`}>
          <div className={`${BASE_CLASS}_instructor_detail_name`}>
            <div>{instructor.firstName}</div>
            <div>{instructor.lastName}</div>
          </div>
          <div className={`${BASE_CLASS}_instructor_detail_status`}>
            {instructor.isActive ? <p className="active">Active</p> : <p className="inActive">No</p>}
            <p className="hours">{instructor.hourType}</p>
          </div>
        </div>
      </div>
      <div className={`${BASE_CLASS}_PeriodandDays`}>
        <div className={`${BASE_CLASS}_PeriodandDays_period`}>
          {instructor.periods.map((time, index) => (
            <p className={time.name} key={`${index}-${time.name}-${instructor.id}`}>
              {time.name}
            </p>
          ))}
        </div>
        <div className={`${BASE_CLASS}_PeriodandDays_days`}>
          {instructor.capabilities.map((day) => (
            <>{day.name} </>
          ))}
        </div>
      </div>
      <div className={`${BASE_CLASS}_course`}>
        {programs.map((program) => (
          <div className={`${BASE_CLASS}_course_program`}>
            <div className={`${BASE_CLASS}_course_program_title`}>{program.program}</div>
            <div className={`${BASE_CLASS}_course_program_course`}>
              {instructor.courses.map((course) =>
                course.program.name === program.program ? <p className={course.color}>{course.name}</p> : <></>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
