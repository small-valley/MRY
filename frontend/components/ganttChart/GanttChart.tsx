import React, { useEffect, useState, useContext } from 'react';
import Grid from './Grid';
import Cohorts from './Cohorts';
import TimeTable from './TimeTable';
import './GanttChart.scss';
import '@/app/schedules/schedules.scss';
import Calendar from 'react-calendar';
import { changeDate } from '@/app/actions/common';
import { CalendarCheck } from 'lucide-react';
import { CohortsContext } from '@/app/contexts/CohortsContext';

const BASE_CLASS = 'schedule_table';

const GanttChart = () => {
  const [startDate, setStartdate] = useState<Date>();
  const [endDate, setEnddate] = useState<Date>();
  const [isCalandar, setIsCalandar] = useState<boolean>(false);
  const { cohorts, getCohorts } = useContext(CohortsContext);

  useEffect(() => {
    if (startDate === undefined && endDate === undefined && cohorts?.length > 0) {
      let initialStartDate = new Date();
      let initialEndDate = new Date();
      cohorts?.map((cohort) => {
        cohort?.schedules?.map((schedule) => {
          if (new Date(schedule.startDate) < initialStartDate) {
            initialStartDate = new Date(schedule.startDate);
          }
          if (new Date(schedule.endDate) > initialEndDate) {
            initialEndDate = new Date(schedule.endDate);
          }
        });
      });
      setStartdate(new Date(initialStartDate));
      setEnddate(new Date(initialEndDate));
    }
  }, [cohorts]);

  const handleDateChange = async (event: any) => {
    setIsCalandar(false);
    setStartdate(event[0]);
    setEnddate(event[1]);
    const formattedStartDate = `${event[0].getFullYear()}-${event[0].getMonth() + 1}-${event[0].getDate()}`;
    const formattedEndDate = `${event[1].getFullYear()}-${event[1].getMonth() + 1}-${event[1].getDate()}`;
    await getCohorts({ startDate: formattedStartDate, endDate: formattedEndDate });
  };
  return (
    <div>
      <div className={`${BASE_CLASS}_listfilter`}>
        <div className={`${BASE_CLASS}_listfilter_first`}>
          <button
            className={`${BASE_CLASS}_listfilter_first_btn`}
            onClick={() => (isCalandar ? setIsCalandar(false) : setIsCalandar(true))}
          >
            <CalendarCheck />
            <h2>{startDate && changeDate(startDate)}</h2>-<h2>{endDate && changeDate(endDate)}</h2>
          </button>
        </div>
        <div className={`init_calendarlist ${isCalandar ? 'calender_list' : ''}`}>
          <Calendar
            onChange={handleDateChange}
            value={startDate && endDate && [startDate, endDate]}
            selectRange={true}
          />
        </div>
      </div>
      <div id="gantt-container">
        <Grid>
          <Cohorts />
          <TimeTable />
        </Grid>
      </div>
    </div>
  );
};

export default GanttChart;
