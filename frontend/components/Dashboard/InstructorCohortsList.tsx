import { changeDate } from '@/app/actions/common';
import { Todo } from '@/type/course';
import { CalendarCheck2 } from 'lucide-react';
import { useState } from 'react';

const BASE_CLASS = 'home_instructorDashboard_cohorts';
type ongoing = {
  cohortId: string;
  cohortName: string;
  courseName: string;
  period: string;
  startDate: Date;
  endDate: Date;
  days: string;
  todos: Todo[];
};
const tmp: ongoing[] = [
  {
    cohortId: 'aaa',
    cohortName: 'E1-0124',
    courseName: 'Analytics',
    period: 'Evening',
    startDate: new Date('2024-03-15'),
    endDate: new Date('2024-05-15'),
    days: 'Monday - Friday',
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
    startDate: new Date('2024-03-15'),
    endDate: new Date('2024-05-15'),
    days: 'Monday - Friday',
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
];
const tmp2: ongoing[] = [
  {
    cohortId: '12345',
    cohortName: 'E1-0124',
    courseName: 'Analytics',
    period: 'Evening',
    startDate: new Date('2024-03-15'),
    endDate: new Date('2024-05-15'),
    days: 'Monday - Friday',
    todos: [
      {
        id: 'todo1',
        title: 'Google Room',
        dueDate: '2024-01-01',
        isCompleted: false,
      },
      {
        id: '12345',
        title: 'Invite',
        dueDate: '2024-01-01',
        isCompleted: true,
      },
    ],
  },
  {
    cohortId: '324',
    cohortName: 'E2-0124',
    courseName: 'E-commerce',
    period: 'Afternoon',
    startDate: new Date('2024-03-15'),
    endDate: new Date('2024-05-15'),
    days: 'Monday - Friday',
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
];

export default function InstructorCohortsList() {
  const [selectedId, setSelectedId] = useState<string>('');
  const toggleSelectedId = (id: string) => {
    if (selectedId === id) {
      setSelectedId('');
    } else {
      setSelectedId(id);
    }
  };
  return (
    <div className={BASE_CLASS}>
      <h2>Ongoing</h2>
      <ul>
        {tmp.map((ongoing, index) => (
          <div
            className={`${BASE_CLASS}_list ${ongoing.period}`}
            key={`${index}-${ongoing.cohortId}-${ongoing.cohortName}`}
          >
            <li onClick={() => toggleSelectedId(ongoing.cohortId)}>
              <h4>{ongoing.cohortName}</h4>
              <p>{ongoing.courseName}</p>
              <span>
                {changeDate(ongoing.startDate)} - {changeDate(ongoing.endDate)}
              </span>
              <div>
                {ongoing.days} / {ongoing.period}
              </div>
            </li>
            {selectedId === ongoing.cohortId && (
              <div className={`${BASE_CLASS}_todo`}>
                {ongoing.todos.map((todo, index) => (
                  <div key={`${index}-${todo.id}-${todo.title}`} id={todo.id} className={`${BASE_CLASS}_todo_wrap`}>
                    <div className={`${BASE_CLASS}_todo_wrap_item`}>
                      <CalendarCheck2 size={20} />
                      <p>{todo.dueDate}</p>
                    </div>
                    <div className={`${BASE_CLASS}_todo_wrap_item`}>
                      <label>{todo.title}</label>
                      {todo.isCompleted ? (
                        <button className="complete">Complete</button>
                      ) : (
                        <button className="ongoing">On Going</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </ul>
      <h2>Upcoming</h2>
      <ul>
        {tmp2.map((ongoing, index) => (
          <div
            className={`${BASE_CLASS}_list ${ongoing.period}`}
            key={`${index}-${ongoing.cohortId}-${ongoing.cohortName}`}
          >
            <li onClick={() => toggleSelectedId(ongoing.cohortId)}>
              <h4>{ongoing.cohortName}</h4>
              <p>{ongoing.courseName}</p>
              <span>
                {changeDate(ongoing.startDate)} - {changeDate(ongoing.endDate)}
              </span>
              <div>
                {ongoing.days} / {ongoing.period}
              </div>
            </li>
            {selectedId === ongoing.cohortId && (
              <div className={`${BASE_CLASS}_todo`}>
                {ongoing.todos.map((todo, index) => (
                  <div key={`${index}-${todo.id}-${todo.title}`} id={todo.id} className={`${BASE_CLASS}_todo_wrap`}>
                    <div className={`${BASE_CLASS}_todo_wrap_item`}>
                      <CalendarCheck2 size={20} />
                      <p>{todo.dueDate}</p>
                    </div>
                    <div className={`${BASE_CLASS}_todo_wrap_item`}>
                      <label>{todo.title}</label>
                      {todo.isCompleted ? (
                        <button className="complete">Complete</button>
                      ) : (
                        <button className="ongoing">On Going</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </ul>
    </div>
  );
}
