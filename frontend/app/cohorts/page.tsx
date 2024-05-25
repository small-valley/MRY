'use client';
import CohortTable from '@/components/Cohort/CohortTable';
import CreateCohort from '@/components/Cohort/CreateCohort';
import { CalendarCheck, NotebookText, Pencil, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { changeDate } from '../actions/common';
import useCohort from '../hooks/cohorts/useCohort';
import './cohorts.scss';

import Calendar from 'react-calendar';
import { Cohort } from '../../../shared/models/responses/getCohortsForFilterResponse';
import useCohortFilter from '../hooks/cohorts/useFilterCohort';

const BASE_CLASS = 'cohort';
const BTN_BASE_CLASS = 'cohort_btn';

export default function Cohorts() {
  const [isEdit, setIsEdit] = useState(false);
  const [cohortId, setCohortId] = useState('');
  const [programId, setProgramId] = useState('');
  const [change, setChange] = useState(0);
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [startDate, setStartdate] = useState<Date>();
  const [endDate, setEnddate] = useState<Date>();
  const [isCalandar, setIsCalandar] = useState<boolean>(false);
  const { cohort, fetchCohort } = useCohort(cohortId, programId);
  const { cohortFilter, fetchCohortFilter } = useCohortFilter(startDate, endDate);

  useEffect(() => {
    const today = new Date();
    const threeMonthsAgo = new Date(today);
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const threeMonthsLater = new Date(today);
    threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);

    setStartdate(threeMonthsAgo);
    setEnddate(threeMonthsLater);
  }, []);

  useEffect(() => {
    fetchCohortFilter();
  }, [startDate, endDate]);

  useEffect(() => {
    if (cohortFilter && cohortFilter.length > 0) {
      setProgramId(cohortFilter[0].programId);
      setCohortId(cohortFilter[0].cohorts[0].cohortId);
    }
  }, [cohortFilter]);

  useEffect(() => {
    if (cohortId) {
      fetchCohort();
    }
  }, [programId, cohortId, change]);

  const handleDateChange = (event: any) => {
    setIsCalandar(false);
    setStartdate(event[0]);
    setEnddate(event[1]);
  };

  const renderCohortOptions = () => {
    if (!cohortFilter || cohortFilter.length <= 0 || programId === '') {
      return null;
    }
    let cohorts: Cohort[] = [];
    // if (programId === '0') {
    //   // if program option is all program, show all cohorts
    //   cohorts = cohortFilter.flatMap((program) => program.cohorts);
    // } else {
    //   cohorts = cohortFilter.filter((program) => program.programId === programId)[0].cohorts;
    // }
    cohorts = cohortFilter.filter((program) => program.programId === programId)[0].cohorts;
    return cohorts.map((cohort, index) => (
      <option value={cohort.cohortId} key={`${index}-${cohort.cohortId}`}>
        {cohort.cohortName}
      </option>
    ));
  };

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
                <div className={`${BASE_CLASS}_header_filter_calendar`}>
                  <button className={`${BTN_BASE_CLASS}_calendar`} onClick={() => setIsCalandar(true)}>
                    <CalendarCheck />
                  </button>
                  <span>{startDate && changeDate(startDate)}</span>-<span>{endDate && changeDate(endDate)}</span>
                </div>
                {cohortFilter && cohortFilter?.length > 0 && (
                  <div className={`${BASE_CLASS}_header_filter_selector`}>
                    <select
                      className={`${BASE_CLASS}_header_filter_selector_program`}
                      onChange={(event) => {
                        setProgramId(event.target.value);
                        const corhortId = cohortFilter?.find((program) => program.programId === event.target.value)
                          ?.cohorts[0].cohortId;
                        setCohortId(corhortId || cohortFilter[0].cohorts[0].cohortId);
                      }}
                      defaultValue={cohort?.program}
                    >
                      {/* <option value={'0'} key={'0'}>
                        All Program
                      </option> */}
                      {cohortFilter.map((program, index) => (
                        <option value={program.programId} key={`${index + program.programId}`}>
                          {program.programName}
                        </option>
                      ))}
                    </select>

                    <select
                      className={`${BASE_CLASS}_header_filter_selector_cohort`}
                      onChange={(event) => setCohortId(event.target.value)}
                      defaultValue={cohortFilter && cohortFilter.length ? cohortFilter[0].cohorts?.[0].cohortName : ''}
                    >
                      {renderCohortOptions()}
                    </select>
                  </div>
                )}
              </div>
              <div className={`${BASE_CLASS}_header_button`}>
                <button className={`${BTN_BASE_CLASS}_save`} type="button" onClick={() => setIsCreate(true)}>
                  Create Cohort
                </button>
              </div>
            </div>
            {cohort && cohortFilter && cohortFilter?.length > 0 && (
              <>
                <div className={`${BASE_CLASS}_title`}>
                  <div className={`${BASE_CLASS}_title_program`}>{cohort.program}</div>
                  <div className={`${BASE_CLASS}_title_cohort`}>{cohort.name}</div>
                  <div className={`${BASE_CLASS}_title_period`}>
                    <div className={cohort.period}> {cohort.period}</div>
                  </div>
                  <div>
                    <button className={`${BTN_BASE_CLASS}_del`}>
                      <Trash2 size={20} />
                    </button>
                  </div>
                  {isEdit ? (
                    <>
                      <div>
                        <button className={`${BTN_BASE_CLASS}_save`} onClick={() => setIsEdit(false)}>
                          <NotebookText size={20} />
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <button className={`${BTN_BASE_CLASS}_save`} onClick={() => setIsEdit(true)}>
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
      <div className={`calender_popup ${isCalandar ? 'calender_popup_selected' : ''}`}>
        <div className="calender_popup_selected_wrap">
          <h2> Select Date</h2>
          <Calendar onChange={handleDateChange} selectRange={true} />
          <button className="close" onClick={() => setIsCalandar(false)}>
            Close
          </button>
        </div>
      </div>
    </>
  );
}
