import { changeDate, putApiData } from '@/app/actions/common';
import { CalendarCheck2 } from 'lucide-react';
import { useState } from 'react';
import { PutTodoRequest } from '../../../shared/models/requests/putTodoRequest';
import { Ongoing, Todo, Upcoming } from '../../../shared/models/responses/getDashboardResponse';

const BASE_CLASS = 'home_instructorDashboard_cohorts';

export default function InstructorCohortsList({
  ongoing,
  upcoming,
  setChange,
}: {
  ongoing: Ongoing[];
  upcoming: Upcoming[];
  setChange: (random: number) => void;
}) {
  const [selectedId, setSelectedId] = useState<string>('');

  const toggleSelectedId = (id: string) => {
    if (selectedId === id) {
      setSelectedId('');
    } else {
      setSelectedId(id);
    }
  };

  const handleUpdateTodo = async (todo: Todo) => {
    const response = await putApiData<PutTodoRequest, null>(`${process.env.NEXT_PUBLIC_API_BASE_URL_B}/todos`, {
      todoId: todo.id,
      dueDate: todo.dueDate,
      isCompleted: !todo.isCompleted,
      title: todo.title,
      description: todo.description,
    });
    setChange(Math.random());
  };

  return (
    <div className={BASE_CLASS}>
      <h2 className={`${BASE_CLASS}_ongoing`}>Ongoing</h2>
      <ul>
        {ongoing.map((ongoing, index) => (
          <div
            className={`${BASE_CLASS}_list ${ongoing.period}`}
            key={`${index}-${ongoing.cohortId}-${ongoing.cohortName}`}
          >
            <li onClick={() => toggleSelectedId(ongoing.scheduleId)}>
              <h4>{ongoing.cohortName}</h4>
              <p>{ongoing.courseName}</p>
              <span>
                {changeDate(ongoing.startDate)} - {changeDate(ongoing.endDate)}
              </span>
              <div>
                {ongoing.day} / {ongoing.period}
              </div>
            </li>
            {selectedId === ongoing.scheduleId && (
              <div className={`${BASE_CLASS}_todo`}>
                {ongoing.todos.map((todo, index) => (
                  <div key={`${index}-${todo.id}-${todo.title}`} id={todo.id} className={`${BASE_CLASS}_todo_wrap`}>
                    <div className={`${BASE_CLASS}_todo_wrap_item`}>
                      <CalendarCheck2 size={20} />
                      <p>{changeDate(todo.dueDate)}</p>
                    </div>
                    <div className={`${BASE_CLASS}_todo_wrap_item`}>
                      <label>{todo.title}</label>
                      {todo.isCompleted ? (
                        <button className="complete" onClick={() => handleUpdateTodo(todo)}>
                          Complete
                        </button>
                      ) : (
                        <button className="ongoing" onClick={() => handleUpdateTodo(todo)}>
                          On Going
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </ul>
      <h2 className={`${BASE_CLASS}_upcoming`}>Upcoming</h2>
      <ul>
        {upcoming.map((upcoming, index) => (
          <div
            className={`${BASE_CLASS}_list ${upcoming.period}`}
            key={`${index}-${upcoming.cohortId}-${upcoming.cohortName}`}
          >
            <li onClick={() => toggleSelectedId(upcoming.scheduleId)}>
              <h4>{upcoming.cohortName}</h4>
              <p>{upcoming.courseName}</p>
              <span>
                {changeDate(upcoming.startDate)} - {changeDate(upcoming.endDate)}
              </span>
              <div>
                {upcoming.day} / {upcoming.period}
              </div>
            </li>
            {selectedId === upcoming.scheduleId && (
              <div className={`${BASE_CLASS}_todo`}>
                {upcoming.todos.map((todo, index) => (
                  <div key={`${index}-${todo.id}-${todo.title}`} id={todo.id} className={`${BASE_CLASS}_todo_wrap`}>
                    <div className={`${BASE_CLASS}_todo_wrap_item`}>
                      <CalendarCheck2 size={20} />
                      <p>{changeDate(todo.dueDate)}</p>
                    </div>
                    <div className={`${BASE_CLASS}_todo_wrap_item`}>
                      <label>{todo.title}</label>
                      {todo.isCompleted ? (
                        <button className="complete" onClick={() => handleUpdateTodo(todo)}>
                          Complete
                        </button>
                      ) : (
                        <button className="ongoing" onClick={() => handleUpdateTodo(todo)}>
                          On Going
                        </button>
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
