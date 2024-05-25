import Image from 'next/image';
import { GetInstructorResponse } from '../../../shared/models/responses/getInstructorResponse';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import './InstructorDetail.scss';

const BASE_CLASS = 'instructorcard';
type Props = {
  instructor: GetInstructorResponse;
  setIsEdit: Dispatch<SetStateAction<boolean>>;
};

export default function InstructorDetail({ instructor, setIsEdit }: Props) {
  const [programs, setPrograms] = useState<string[]>();
  const instructorsCourses = instructor.courses.filter((item, pos) => {
    return instructor.courses.map((course) => course.name).indexOf(item.name) === pos;
  });

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

  /*
  const programs = instructor.courses
    .filter(
      (course, index, arr) =>
        arr.findLastIndex(
          (course2) => course2.program.name === course.program.name
        ) === index
    )
    .map((course) => {
      return {
        program: course.program.name,
      };
    });
    */

  return (
    <>
      {instructor && (
        <ul className={BASE_CLASS}>
          <div className={`${BASE_CLASS}_title`} key={instructor.id + 'title'}>
            <button type="button" className="edit" onClick={() => setIsEdit(true)}>
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
                <p className={period.name} key={`${period}-${index}`}>
                  {period.name}
                </p>
              ))}
            </div>
          </li>
          <li className={`${BASE_CLASS}_days`} key={instructor.id + 'days'}>
            <div>Days</div>
            <div>
              {instructor.capabilities.map((day, index) => (
                <p key={`${day.name}-${index}-${instructor.id}`}>{day.name}</p>
              ))}
            </div>
          </li>
          {programs &&
            programs.map((program, index) => (
              <li className={`${BASE_CLASS}_course`} key={`${program}-${index}-${instructor.id}`}>
                <div className={`${BASE_CLASS}_course_program_title`}>{program} Courses</div>
                <div className={`${BASE_CLASS}_course_program_course`}>
                  {instructorsCourses.map((course, index: number) =>
                    course.program.name === program ? (
                      <p className={course.color} key={`${index}-${course.color}-${course.program}`}>
                        {course.name}
                      </p>
                    ) : null
                  )}
                </div>
              </li>
            ))}
        </ul>
      )}
    </>
  );
}
