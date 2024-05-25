import { getAccessToken } from '@/app/actions/common';
import { CohortsContext } from '@/app/contexts/CohortsContext';
import { useContext, useEffect, useState } from 'react';
import { GetCohortsResponse, Instructor, Schedule } from '../../../shared/models/responses/getCohortsResponse';
import {
  createFormattedWeekFromStr,
  currentStatusColor,
  getWeeksInMonth,
  monthDiff,
  months,
  weekDiff,
} from '../../lib/timeTableHelper';
import AvailableInstructorList from './AvailableInstructorList';
import InstructorAvatar from './InstructorAvatar';

interface Open {
  [key: string]: boolean;
}

interface TimeRange {
  fromSelectMonth: number;
  fromSelectYear: string;
  toSelectMonth: number;
  toSelectYear: string;
}

const TimeTable = () => {
  const initialTimeRange = {
    fromSelectMonth: 0,
    fromSelectYear: '',
    toSelectMonth: 11,
    toSelectYear: '',
  };
  const { cohorts, getCohorts } = useContext(CohortsContext);
  const [instructorAvatarModalOpen, setInstructorAvatarModalOpen] = useState<Open>({});
  const [courseInfoModalOpen, setCourseInfoModalOpen] = useState<Open>({});
  const [scheduleId, setScheduleId] = useState<string>('');
  const [timeRange, setTimeRange] = useState<TimeRange>(initialTimeRange);
  const [user, setUser] = useState<Instructor | undefined>(undefined);
  const [fromList, setFromList] = useState<boolean>(false);
  const [availableInstructors, setAvailableInstructors] = useState([]);
  const [availableInstructorsPreference, setAvailableInstructorsPreference] = useState([]);
  const [unavailableInstructors, setUnavailableInstructors] = useState([]);

  useEffect(() => {
    let oldestStartDate = '';
    let latestEndDate = '';

    cohorts?.map((cohort: GetCohortsResponse) => {
      cohort.schedules.map((schedule: Schedule) => {
        const scheduleId = schedule.id;
        setInstructorAvatarModalOpen((prevState) => ({
          ...prevState,
          [scheduleId]: false,
        }));
        setCourseInfoModalOpen((prevState) => ({
          ...prevState,
          [scheduleId]: false,
        }));
        if (oldestStartDate === '' || schedule.startDate < oldestStartDate) {
          oldestStartDate = schedule.startDate;
        }
        if (latestEndDate === '' || schedule.endDate > latestEndDate) {
          latestEndDate = schedule.endDate;
        }
      });
    });

    setTimeRange({
      fromSelectMonth: new Date(oldestStartDate).getMonth(),
      fromSelectYear: new Date(oldestStartDate).getFullYear().toString(),
      toSelectMonth: new Date(latestEndDate).getMonth(),
      toSelectYear: new Date(latestEndDate).getFullYear().toString(),
    });
  }, [cohorts]);

  const getAvailableInstructors = async (scheduleId: string) => {
    const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL_A}/availability/${scheduleId}`;
    const response = await fetch(baseUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (!data?.data?.availableInstructors) return;
    setAvailableInstructors(data.data.availableInstructors.availableInstructors);
    setAvailableInstructorsPreference(data.data.availableInstructors.availableInstructorsPreference);
    setUnavailableInstructors(data.data.availableInstructors.unavailableInstructors);
  };

  // creating rows
  const startMonth = new Date(parseInt(timeRange.fromSelectYear), timeRange.fromSelectMonth);
  const endMonth = new Date(parseInt(timeRange.toSelectYear), timeRange.toSelectMonth);
  const numMonths = monthDiff(startMonth, endMonth) + 1;
  let month = new Date(startMonth);

  let monthRows = [];
  let dayRows = [];
  let dayRow = [];
  let cohortRows: Array<JSX.Element> = [];
  let cohortRow: Array<JSX.Element> = [];

  for (let i = 0; i < numMonths; i++) {
    // create month rows
    monthRows.push(
      <div
        key={i}
        style={{
          display: 'grid',
          gridAutoFlow: 'column',
          gridAutoColumns: 'minmax(64px, 1fr)',
          outline: '0.5px solid var(--color-outline)',
          textAlign: 'center',
          height: 'var(--cell-height)',
        }}
      >
        <span style={{ margin: 'auto' }}>{months[month.getMonth()] + ' ' + month.getFullYear()}</span>
      </div>
    );

    // create day and week rows
    const numWeeks = getWeeksInMonth(month.getFullYear(), month.getMonth() + 1);

    for (let j = 1; j <= numWeeks; j++) {
      dayRow.push(
        <div
          key={j}
          style={{
            display: 'grid',
            gridAutoFlow: 'column',
            gridAutoColumns: 'minmax(64px, 1fr)',
            outline: '0.5px solid var(--color-outline)',
            textAlign: 'center',
            height: 'var(--cell-height)',
          }}
        >
          <span style={{ margin: 'auto' }}>W{j}</span>
        </div>
      );
    }

    dayRows.push(
      <div
        key={i}
        style={{
          display: 'grid',
          gridAutoFlow: 'column',
          gridAutoColumns: 'minmax(64px, 1fr)',
          outline: '0.5px solid var(--color-outline)',
          textAlign: 'center',
          height: 'var(--cell-height)',
        }}
      >
        {dayRow}
      </div>
    );

    dayRow = [];
    month.setMonth(month.getMonth() + 1);
  }

  // create cohort rows
  if (cohorts) {
    cohorts.forEach((cohort: GetCohortsResponse) => {
      let month = new Date(startMonth);
      for (let i = 0; i < numMonths; i++) {
        const curYear = month.getFullYear();
        const curMonth = month.getMonth() + 1;

        const numWeeks = getWeeksInMonth(curYear, curMonth);

        for (let j = 1; j <= numWeeks; j++) {
          cohortRow.push(
            <div
              key={`${cohort.id}-${j}`}
              style={{
                position: 'relative',
                outline: '0.5px solid var(--color-outline)',
                marginTop: '0.5px',
              }}
              data-cohort={cohort.id}
              data-date={`${curYear}-${curMonth}-Week${j}`}
            >
              {cohort.schedules.map((schedule: Schedule, i: number) => {
                if (
                  schedule.cohortId === cohort.id &&
                  createFormattedWeekFromStr(schedule.startDate) === `${curYear}-${curMonth}-Week${j}`
                ) {
                  return (
                    <div
                      className="cohortDuration"
                      key={`${i}-${schedule.id}`}
                      tabIndex={0}
                      onClick={async () => {
                        await getAvailableInstructors(schedule.id);
                        setCourseInfoModalOpen({
                          [schedule.id]: !courseInfoModalOpen[schedule.id],
                        });
                        setScheduleId(schedule.id);
                      }}
                      style={{
                        height:
                          schedule.course.name === 'Break' || schedule.days?.includes('Monday - Friday')
                            ? 'calc(var(--cell-height) - 1px)'
                            : '50%',
                        top: `${
                          schedule.course.name === 'Break' ||
                          schedule.days?.includes('Monday - Wednesday') ||
                          schedule.days?.includes('Monday - Friday')
                            ? 0
                            : '50%'
                        }`,
                        width: `calc(${weekDiff(schedule.startDate, schedule.endDate)} * 100% - 1px)`,
                        background: currentStatusColor(schedule),
                      }}
                    >
                      {schedule.course.name !== 'Break' ? (
                        <InstructorAvatar
                          schedule={schedule}
                          open={instructorAvatarModalOpen}
                          setOpen={setInstructorAvatarModalOpen}
                          user={user}
                          getCohorts={getCohorts}
                          courseInfoModalOpen={courseInfoModalOpen}
                          fromList={fromList}
                          setFromList={setFromList}
                        />
                      ) : (
                        <div></div>
                      )}
                      <p className="gantt-course_name">{schedule.course.name}</p>
                      <div></div>
                    </div>
                  );
                }
              })}
            </div>
          );
        }

        cohortRows.push(
          <div
            key={`${i}-${cohort.id}`}
            style={{
              display: 'grid',
              gridAutoFlow: 'column',
              gridAutoColumns: 'minmax(64px, 1fr)',
              outline: '0.5px solid var(--color-outline)',
              textAlign: 'center',
              height: 'var(--cell-height)',
            }}
          >
            {cohortRow}
          </div>
        );

        cohortRow = [];
        month.setMonth(month.getMonth() + 1);
      }
    });
  }

  return (
    <>
      <div id="gantt-grid-container__time" style={{ gridTemplateColumns: `repeat(${numMonths}, 1fr)` }}>
        {monthRows}
        {dayRows}
        <div
          id="gantt-time-period-cell-container"
          style={{
            gridColumn: '1/-1',
            display: 'grid',
            gridTemplateColumns: `repeat(${numMonths}, 1fr)`,
            paddingLeft: '0.5px',
          }}
        >
          {cohortRows}
        </div>
      </div>
      {courseInfoModalOpen[scheduleId] && (
        <AvailableInstructorList
          setUser={setUser}
          setFromList={setFromList}
          availableInstructors={availableInstructors}
          availableInstructorsPreference={availableInstructorsPreference}
          unavailableInstructors={unavailableInstructors}
        />
      )}
    </>
  );
};

export default TimeTable;
