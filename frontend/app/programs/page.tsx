'use client';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

//function, type
import usePrograms from '../hooks/programs/usePrograms';
import { Department } from '../testdata';
//use component
import ProgramShow from '@/components/programs/ProgramShow';
import ProgramAdd from '@/components/programs/ProgramAdd';
import './program.scss';

const BASE_CLASS = 'program';

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
        <div className={`${BASE_CLASS}_header`}>
          <div className={`${BASE_CLASS}_header_filter`}>
            <div className={`${BASE_CLASS}_header_filter_selector`}>
              <select className={`${BASE_CLASS}_header_filter_selector_department`}>
                <option value="0" key="department">
                  All Department
                </option>
                {Department.map((item, index) => (
                  <option value={index + 1} key={index + 'department'}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
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
                <button onClick={() => setIsAdd(true)}>
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
