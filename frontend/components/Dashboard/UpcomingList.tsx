import { changeDate } from '@/app/actions/common';
import { Upcoming } from '../../../shared/models/responses/getDashboardResponse';

const BASE_CLASS = 'home_dashboard_upcoming';

type Props = {
  upcoming: Upcoming[];
};

export default function UpcomingList({ upcoming }: Props) {
  return (
    <div className={BASE_CLASS}>
      <h2>Upcoming</h2>
      <div className="title">
        <div>Course</div>
        <div>Start Date</div>
        <div>Cohort</div>
        <div>Todo</div>
      </div>
      <ul>
        {upcoming.map((upcoming, index) => (
          <li key={`${index}-${upcoming.cohortId}-${upcoming.cohortName}`}>
            <div>{upcoming.courseName}</div>
            <div>{changeDate(upcoming.startDate)}</div>
            <div>{upcoming.cohortName}</div>
            <div>
              {upcoming.todos.map((todo, index) => (
                <div className={todo.isCompleted ? 'complete' : 'ongoing'} key={index}>
                  {todo.title}
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
