'use client';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

//function, type
import usePrograms from '../hooks/programs/usePrograms';
//use component
import ProgramShow from '@/components/programs/ProgramShow';
import ProgramAdd from '@/components/programs/ProgramAdd';
import './program.scss';

const BASE_CLASS = 'program';
const BTN_BASE_CLASS = 'program_btn';

export default function Programs() {
  const { programs, fetchPrograms } = usePrograms();
  const [change, setChange] = useState(0);
  const [isAdd, setIsAdd] = useState(false);

  useEffect(() => {
    fetchPrograms();
  }, [change]);
  return (
    <>
      <div className={BASE_CLASS}>
        <div className={`${BASE_CLASS}_content`}>
          {programs &&
            programs.map((program, index) => (
              <div className={`${BASE_CLASS}_content_wrap`} key={`${index}-${program.id}-${program.name}`}>
                <ProgramShow program={program} setChange={setChange} />
              </div>
            ))}

          {isAdd ? (
            <>
              <div className={`${BASE_CLASS}_content_wrap`}>
                <ProgramAdd setChange={setChange} setIsAdd={setIsAdd} />
              </div>
            </>
          ) : (
            <>
              <div className={`${BASE_CLASS}_content_wrap_add`}>
                <button type="button" className={`${BTN_BASE_CLASS}_add`} onClick={() => setIsAdd(true)}>
                  <Plus size={25} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
