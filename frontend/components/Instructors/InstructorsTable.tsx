'use client';

import { useState } from 'react';
import { GetInstructorResponse } from '../../../shared/models/responses/getInstructorResponse';
import InstructorTableRow from './InstructorTableRow';

const BASE_CLASS = 'instructors_table';

type Props = {
  instructors: GetInstructorResponse[];
};

export default function InstructorsTable({ instructors }: Props) {
  const [selectedId, setSelectedId] = useState('');
  const [isClick, setClick] = useState(false);

  const toggleSelectedInstructor = (courseId: string) => {
    if (selectedId === courseId) {
      setClick(false);
      setSelectedId('');
    } else {
      setClick(true);
      setSelectedId(courseId);
    }
  };
  return (
    <>
      <ul className={BASE_CLASS}>
        <li className={`${BASE_CLASS}_header`} key="instructor_header">
          <div>Instructor</div>
          <div>Period and Days</div>
          <div>Courses</div>
        </li>
        {instructors &&
          instructors.map((instructor, index) => (
            <li
              key={instructor.id}
              className={`${BASE_CLASS}_content`}
              onClick={() => toggleSelectedInstructor(instructor.id)}
            >
              <InstructorTableRow instructor={instructor} />
            </li>
          ))}
      </ul>
    </>
  );
}
