import { changeDate } from '@/app/actions/common';
import { Todo } from '@/type/course';

const BASE_CLASS = 'home_dashboard_upcoming';

type upcoming = {
  cohortId: string;
  cohortName: string;
  courseName: string;
  period: string;
  startDate: Date;
  todos: Todo[];
};
const tmp: upcoming[] = [
  {
    cohortId: 'aaa',
    cohortName: 'E1-0124',
    courseName: 'Analytics',
    period: 'Evening',
    startDate: new Date('2024-04-10'),
    todos: [
      {
        id: 'todo1',
        title: 'Google Room',
        dueDate: '2024-01-01',
        isCompleted: false,
      },
      {
        id: 'todo2',
        title: 'Invite',
        dueDate: '2024-01-01',
        isCompleted: true,
      },
    ],
  },
  {
    cohortId: 'bbb',
    cohortName: 'E2-0124',
    courseName: 'Advanced Strategies',
    period: 'Evening',
    startDate: new Date('2024-04-10'),
    todos: [
      {
        id: 'todo1',
        title: 'Google Room',
        dueDate: '2024-01-01',
        isCompleted: false,
      },
      {
        id: 'todo2',
        title: 'Invite',
        dueDate: '2024-01-01',
        isCompleted: true,
      },
    ],
  },
  {
    cohortId: 'ccc',
    cohortName: 'E2-0124',
    courseName: 'E-commerce',
    period: 'Afternoon',
    startDate: new Date('2024-04-10'),
    todos: [
      {
        id: 'todo1',
        title: 'Google Room',
        dueDate: '2024-01-01',
        isCompleted: false,
      },
      {
        id: 'todo2',
        title: 'Invite',
        dueDate: '2024-01-01',
        isCompleted: true,
      },
    ],
  },
  {
    cohortId: 'ddd',
    cohortName: 'A1-0124',
    period: 'Morning',
    courseName: 'Program Project',
    startDate: new Date('2024-04-10'),
    todos: [
      {
        id: 'todo1',
        title: 'Google Room',
        dueDate: '2024-01-01',
        isCompleted: false,
      },
      {
        id: 'todo2',
        title: 'Invite',
        dueDate: '2024-01-01',
        isCompleted: true,
      },
    ],
  },
  {
    cohortId: 'eee',
    cohortName: 'E3-0124',
    period: 'Afternoon',
    courseName: 'Analytics',
    startDate: new Date('2024-04-10'),
    todos: [
      {
        id: 'todo1',
        title: 'Google Room',
        dueDate: '2024-01-01',
        isCompleted: false,
      },
      {
        id: 'todo2',
        title: 'Invite',
        dueDate: '2024-01-01',
        isCompleted: true,
      },
    ],
  },
  {
    cohortId: 'ccc',
    cohortName: 'E2-0124',
    courseName: 'E-commerce',
    period: 'Afternoon',
    startDate: new Date('2024-04-10'),
    todos: [
      {
        id: 'todo1',
        title: 'Google Room',
        dueDate: '2024-01-01',
        isCompleted: false,
      },
      {
        id: 'todo2',
        title: 'Invite',
        dueDate: '2024-01-01',
        isCompleted: true,
      },
    ],
  },
  {
    cohortId: 'ddd',
    cohortName: 'A1-0124',
    period: 'Morning',
    courseName: 'Program Project',
    startDate: new Date('2024-04-10'),
    todos: [
      {
        id: 'todo1',
        title: 'Google Room',
        dueDate: '2024-01-01',
        isCompleted: false,
      },
      {
        id: 'todo2',
        title: 'Invite',
        dueDate: '2024-01-01',
        isCompleted: true,
      },
    ],
  },
  {
    cohortId: 'eee',
    cohortName: 'E3-0124',
    startDate: new Date('2024-04-10'),
    todos: [
      {
        id: 'todo1',
        title: 'Google Room',
        dueDate: '2024-01-01',
        isCompleted: false,
      },
      {
        id: 'todo2',
        title: 'Invite',
        dueDate: '2024-01-01',
        isCompleted: true,
      },
    ],
    period: 'Afternoon',
    courseName: 'Analytics',
  },
];
export default function UpcomingList() {
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
        {tmp.map((upcoming, index) => (
          <li key={`${index}-${upcoming.cohortId}-${upcoming.cohortName}`}>
            <div>{upcoming.courseName}</div>
            <div>{changeDate(upcoming.startDate)}</div>
            <div>{upcoming.cohortName}</div>
            <div>
              {upcoming.todos.map((todo, index) => (
                <div className={todo.isCompleted ? 'complete' : 'ongoing'}>{todo.title}</div>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
