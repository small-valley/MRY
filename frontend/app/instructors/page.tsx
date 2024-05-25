'use client';
import { Department } from '../testdata';
import InstructorsTable from '@/components/Instructors/InstructorsTable';
import './instructors.scss';
import { useEffect, useState } from 'react';

import useInstructorlist from '../hooks/instructors/useInstructorlist';
import InstructorsList from '@/components/Instructors/InstructorsList';

const BASE_CLASS = 'instructors';
const BTN_BASE_CLASS = 'instructors_btn';

export default function Instructors() {
  const [department, setDepartment] = useState('all');
  const { instructors, fetchInstructorlist } = useInstructorlist();
  const [isList, setList] = useState(false);
  const [isCard, setCard] = useState(true);
  const toggleList = () => {
    setList(true);
    setCard(false);
  };
  const toggleCard = () => {
    setList(false);
    setCard(true);
  };
  useEffect(() => {
    fetchInstructorlist();
  }, [department]);

  return (
    <>
      <div className={BASE_CLASS}>
        <div className={`${BASE_CLASS}_header`}>
          <div className={`${BASE_CLASS}_header_filter`}>
            <div className={`${BASE_CLASS}_header_filter_btn`}>
              <button type="button" className={`${BTN_BASE_CLASS}_list`} onClick={toggleCard}>
                Card
              </button>
              <button type="button" className={`${BTN_BASE_CLASS}_list`} onClick={toggleList}>
                List
              </button>
            </div>
          </div>
        </div>

        {isCard ? <>{instructors && <InstructorsList instructors={instructors} />}</> : <></>}
        {isList ? <>{instructors && <InstructorsTable instructors={instructors} />}</> : <></>}
      </div>
    </>
  );
}
