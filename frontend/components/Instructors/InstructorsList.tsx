'use client';

import { useEffect, useState } from 'react';
import { GetInstructorResponse } from '../../../shared/models/responses/getInstructorResponse';
import InstructorListRow from './instructorsListRow';
import InstructorDetail from './InstructorDetail';
import useInstructor from '@/app/hooks/instructors/useInstructor';
import InstructorSchedule from './instructorSchedule';
import InstructorVacation from './InstructorVacation';
import './InstructorDetail.scss';
import InstructorDetailEdit from './InstructorDetailEdit';

const BASE_CLASS = 'instructors_content';

type Props = {
  instructors: GetInstructorResponse[];
};

export default function InstructorsList({ instructors }: Props) {
  const [selectedId, setSelectedId] = useState(instructors[0].id);
  const { instructor, fetchInstructor } = useInstructor(selectedId);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const toggleSelectedInstructor = (id: string) => {
    setSelectedId(id);
  };

  useEffect(() => {
    fetchInstructor(selectedId);
  }, [selectedId]);

  console.log(instructor);

  return (
    <>
      <div className={BASE_CLASS}>
        <ul className={`${BASE_CLASS}_list`}>
          <h3 className={`${BASE_CLASS}_title`}> Digital Marketing Instructors</h3>
          <div className={`${BASE_CLASS}_list_filter`}>
            <input type="checkbox" id="active" name="checkbox" />
            <div>Active</div>
          </div>
          <li className={`${BASE_CLASS}_list_header`} key="instructor_header">
            <div>Profile</div>
            <div>Name</div>
            <div>Status</div>
            <div>Hour</div>
          </li>
          {instructors &&
            instructors.map((instructor, index) => (
              <li
                key={`${instructor.id}-${index}-${instructor.lastName}`}
                className={`${BASE_CLASS}_list_content`}
                onClick={() => toggleSelectedInstructor(instructor.id)}
              >
                <InstructorListRow instructor={instructor} />
              </li>
            ))}
        </ul>
        <div className={`${BASE_CLASS}_detail`}>
          <h3 className={`${BASE_CLASS}_title`}>Instructor Information</h3>
          {isEdit
            ? instructor && <InstructorDetailEdit instructor={instructor} setIsEdit={setIsEdit} />
            : instructor && <InstructorDetail instructor={instructor} setIsEdit={setIsEdit} />}
        </div>
        <div className={`${BASE_CLASS}_schedule`}>
          <div className={`${BASE_CLASS}_schedule_class`}>
            <h3 className={`${BASE_CLASS}_title`}>Instructor Schedule</h3>
            <InstructorSchedule id={selectedId} />
          </div>
          <div className={`vacationcard`}>
            <InstructorVacation id={selectedId} />
          </div>
        </div>
      </div>
    </>
  );
}
