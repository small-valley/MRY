'use client';
import CohortTable from '@/components/Cohort/CohortTable';
import { BetweenVerticalStart, ChevronDown, NotebookText, Pencil, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import useCohort from '../hooks/cohorts/useCohort';
import { Cohort, Department, Program } from '../testdata';
import './cohorts.scss';
import CreateCohort from '@/components/Cohort/CreateCohort';

const BASE_CLASS = 'cohort';

export default function Cohorts() {
  const [isEdit, setIsEdit] = useState(false);
  const [cohortId, setCohortId] = useState('d9744368-a4e6-4dc7-ad45-54bbafbf9f19');
  const { cohort, fetchCohort } = useCohort(cohortId);
  const [change, setChange] = useState(0);
  const [isCreate, setIsCreate] = useState<boolean>(false);

  const changeCohortId = () => {
    setCohortId('abdbb29f-b95e-4c3d-aaca-b22ef257f81c');
  };

  useEffect(() => {
    fetchCohort();
  }, [cohortId, change]);

  return (
    <>
      <div className={BASE_CLASS}>
        {isCreate ? (
          <>
            <CreateCohort setCohortId={setCohortId} setChange={setChange} setIsCreate={setIsCreate} start={0} />
          </>
        ) : (
          <>
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

                  <select className={`${BASE_CLASS}_header_filter_selector_program`}>
                    <option value="0" key="program">
                      All Program
                    </option>
                    {Program.map((item, index) => (
                      <option value={index + 1} key={index + 'program'}>
                        {item}
                      </option>
                    ))}
                  </select>

                  <select className={`${BASE_CLASS}_header_filter_selector_cohort`}>
                    <option value="0" key="cohort">
                      All cohort
                    </option>
                    {Cohort.map((item, index) => (
                      <option value={index + 1} key={index + 'cohort'}>
                        {item}
                      </option>
                    ))}
                  </select>

                  <ChevronDown size={25} />
                </div>
                <div className={`${BASE_CLASS}_header_filter_status`}>
                  <input type="checkbox" id="finished" name="checkbox" />
                  <div>Finished</div>
                  <input type="checkbox" id="ongoing" name="checkbox" />
                  <div>Ongoing</div>
                  <input type="checkbox" id="upcoming" name="checkbox" />
                  <div>Upcoming</div>
                  <button className="btn-lg btn-primary" onClick={changeCohortId}>
                    <Search size={20} />
                  </button>
                </div>
              </div>
              <div className={`${BASE_CLASS}_header_button`}>
                <button type="button" onClick={() => setIsCreate(true)}>
                  Create Cohort
                </button>
              </div>
            </div>
            {cohort && (
              <>
                <div className={`${BASE_CLASS}_title`}>
                  <div className={`${BASE_CLASS}_title_program`}>{cohort.program}</div>
                  <div className={`${BASE_CLASS}_title_cohort`}>{cohort.name}</div>
                  <div className={`${BASE_CLASS}_title_period`}>
                    <div className={cohort.period}> {cohort.period}</div>
                  </div>
                  <div className={`${BASE_CLASS}_title_del`}>
                    <button>
                      <Trash2 size={20} />
                    </button>
                  </div>
                  {isEdit ? (
                    <>
                      <div className={`${BASE_CLASS}_title_edit`}>
                        <button onClick={() => setIsEdit(false)}>
                          <NotebookText size={20} />
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className={`${BASE_CLASS}_title_edit`}>
                        <button onClick={() => setIsEdit(true)}>
                          <Pencil size={20} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
                <CohortTable cohort={cohort} isEdit={isEdit} setChange={setChange} />
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}
