'use client';

import { useEffect, useState } from 'react';
import useInstructor from '../hooks/instructors/useInstructor';
import InstructorDetail from '@/components/Instructors/InstructorDetail';
import InstructorVacation from '@/components/Instructors/InstructorVacation';
import InstructorDetailEdit from '@/components/Instructors/InstructorDetailEdit';

const BASE_CLASS = 'profile';

export default function Profile() {
  const [id, setId] = useState('c618691b-c29d-48b0-9426-d0b0498c1d05');

  const [isEdit, setIsEdit] = useState<boolean>(false);

  const { instructor, fetchInstructor } = useInstructor(id);
  useEffect(() => {
    fetchInstructor(id);
  }, [id]);

  return (
    <>
      {instructor && (
        <div className={BASE_CLASS}>
          <div className={`${BASE_CLASS}_card`}>
            {isEdit
              ? instructor && <InstructorDetailEdit instructor={instructor} setIsEdit={setIsEdit} />
              : instructor && <InstructorDetail instructor={instructor} setIsEdit={setIsEdit} />}
          </div>
          <div className={`${BASE_CLASS}_card`}>
            <InstructorVacation id={id} />
          </div>
        </div>
      )}
    </>
  );
}
