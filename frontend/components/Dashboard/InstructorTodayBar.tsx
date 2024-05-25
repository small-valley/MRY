import { Today } from '../../../shared/models/responses/getDashboardResponse';

const BASE_CLASS = 'home_todaybar';

export default function InstructorTodayBar({ todayBar }: { todayBar: Today[] }) {
  return (
    <div className={BASE_CLASS}>
      <h1> Today</h1>
      {todayBar.map((today, index) => (
        <li key={`${index}-${today.cohortId}-${today.cohortName}`}>
          <div>
            <h3>{today.courseName}</h3>
            <p className={today.period}>{today.period}</p>
          </div>
          <label>{today.instructor}</label>
          <div>
            {today.cohortName} / {today.room}
          </div>
        </li>
      ))}
    </div>
  );
}
