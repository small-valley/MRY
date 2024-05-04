import { changeDate } from '@/app/actions/common';
import { CalendarCheck2 } from 'lucide-react';
import { Todo as TodoType } from '../../../shared/models/responses/getAvailabilityResponse';
import './todo.scss';

const BASE_CLASS = 'todo';

type Props = {
  todos: TodoType[];
};
export default function Todo({ todos }: Props) {
  return (
    <>
      <div className={BASE_CLASS}>
        <div className={`${`${BASE_CLASS}_wrap`}`}>
          {todos.map((todo, index) => (
            <div key={`${index}-${todo.id}-${todo.title}`} id={todo.id} className={`${`${BASE_CLASS}_wrap_list`}`}>
              <div>
                <CalendarCheck2 size={20} />
                <p>{changeDate(todo.dueDate)}</p>
              </div>
              <div>
                <div>{todo.title}</div>
                {todo.isCompleted ? (
                  <button className="complete">Complete</button>
                ) : (
                  <button className="ongoing">On Going</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
