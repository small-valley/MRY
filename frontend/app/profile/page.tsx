'use client';

import { useEffect, useState } from 'react';
import useInstructor from '../hooks/instructors/useInstructor';
import InstructorDetail from '@/components/Instructors/InstructorDetail';
import InstructorVacation from '@/components/Instructors/InstructorVacation';
import InstructorDetailEdit from '@/components/Instructors/InstructorDetailEdit';
import { useCurrentUserContext } from '../contexts/CurrentUserContext';

const BASE_CLASS = 'profile';

export default function Profile() {
  // const [id, setId] = useState('fa18c234-4c5f-43fc-b44a-5e927fec7bf0');

  const {currentUser} = useCurrentUserContext();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const { instructor, fetchInstructor } = useInstructor(currentUser?.userId || '');
  useEffect(() => {
    if (currentUser) {
      fetchInstructor(currentUser?.userId);
    }
  }, [currentUser]);

  return (
    <>
      {instructor && (
        <div className={BASE_CLASS}>
          <div className={`${BASE_CLASS}_card`}>
            {isEdit
              ? instructor && <InstructorDetailEdit instructor={instructor} fetchInstructor={fetchInstructor} setIsEdit={setIsEdit} />
              : instructor && <InstructorDetail instructor={instructor} setIsEdit={setIsEdit} />}
          </div>
          <div className={`${BASE_CLASS}_card`}>
            <InstructorVacation id={currentUser?.userId || ''} />
          </div>
        </div>
      )}
    </>
  );
}
