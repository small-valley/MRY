import { changeDate, putApiData } from '@/app/actions/common';
import { ArrowLeft, CalendarCheck2, Check, Plus } from 'lucide-react';
import { useState } from 'react';
import Calendar from 'react-calendar';
import { PutTodoRequest } from '../../../shared/models/requests/putTodoRequest';
import { Todo as TodoType } from '../../../shared/models/responses/getAvailabilityResponse';
import TodoAdd from './TodoAdd';
import './todo.scss';

const BASE_CLASS = 'todo';

type Props = {
  todos: TodoType[];
  scheduleId: string;
  setChange: (random: number) => void;
};
export default function Todo({ todos, scheduleId, setChange }: Props) {
  const [isCalandar, setIsCalandar] = useState<boolean>(false);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [todoIdForDueDate, setTodoIdForDueDateEdition] = useState<string>('');
  const [todoIdForTitleEdition, setTodoIdForTitleEdition] = useState<string>('');
  const [isClickTodoTitle, setIsClickTodoTitle] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [isAddTodo, setIsAddTodo] = useState<boolean>(false);

  const handleUpdateTodo = async (isCompletedChange: boolean, index: number, todoIdFromElement?: string) => {
    // HACK: This is a hacky way to get the proper todoId
    // Originally it stored todo.id in the elements inside the map function, but It didn't return proper todoId when trying to update the todo.
    const todo = todos.find((todo) => todo.id === (todoIdFromElement ?? todoIdForDueDate));
    if (todo) {
      const response = await putApiData<PutTodoRequest, null>(`${process.env.NEXT_PUBLIC_API_BASE_URL_B}/todos`, {
        ...todo,
        todoId: todo.id,
        dueDate: dueDate ?? todo.dueDate,
        isCompleted: isCompletedChange ? !todo.isCompleted : todo.isCompleted,
        title: title || todo.title,
      });
      setIsCalandar(false);
      setDueDate(null);
      setTodoIdForDueDateEdition('');
      setTodoIdForTitleEdition('');
      setTitle('');
      setChange(Math.random());
    }
  };

  const handleDateChange = (event: any) => {
    setDueDate(event);
  };

  return (
    <>
      <div className={BASE_CLASS}>
        <div className={`${`${BASE_CLASS}_wrap`}`}>
          {todos.map((todo, index) => (
            <div key={`${index}-${todo.id}-${todo.title}`} id={todo.id} className={`${`${BASE_CLASS}_wrap_list`}`}>
              <div>
                <CalendarCheck2
                  size={20}
                  onClick={() => {
                    setIsCalandar(true);
                    setTodoIdForDueDateEdition(todo.id);
                  }}
                />
                <p>{changeDate(todo.dueDate)}</p>
              </div>
              <div className={`${`${BASE_CLASS}_wrap_list_detail`}`}>
                <>
                  {isClickTodoTitle && todo.id === todoIdForTitleEdition ? (
                    <form
                      className={`${`${BASE_CLASS}_wrap_list_detail_form`}`}
                      action={() => handleUpdateTodo(false, index, todo.id)}
                    >
                      <input
                        name="title"
                        type="text"
                        value={todo.title}
                        placeholder={todo.title}
                        onChange={(event) => setTitle(event.target.value)}
                        required={true}
                      />
                      <button className="todo_btn_add" type="submit">
                        <Check size={15} />
                      </button>
                      <button
                        className="todo_btn_add"
                        type="button"
                        onClick={() => {
                          setIsClickTodoTitle(false);
                          setTodoIdForTitleEdition('');
                        }}
                      >
                        <ArrowLeft size={15} />
                      </button>
                    </form>
                  ) : (
                    <div
                      onClick={() => {
                        setIsClickTodoTitle(true);
                        setTodoIdForTitleEdition(todo.id);
                      }}
                    >
                      {todo.title}
                    </div>
                  )}
                </>
                {todo.isCompleted ? (
                  <button className="complete" onClick={() => handleUpdateTodo(true, index, todo.id)}>
                    Complete
                  </button>
                ) : (
                  <button className="ongoing" onClick={() => handleUpdateTodo(true, index, todo.id)}>
                    On Going
                  </button>
                )}
              </div>
              <div className={`todocalender_popup ${isCalandar ? 'todocalender_popup_selected' : ''}`}>
                <div className="todocalender_popup_selected_wrap">
                  <h2> Select Due Date</h2>

                  <Calendar onChange={handleDateChange} selectRange={false} />
                  <div className="todocalender_popup_selected_wrap_btn">
                    <button className="close" onClick={() => handleUpdateTodo(false, index)}>
                      Save
                    </button>
                    <button
                      className="close"
                      onClick={() => {
                        setTodoIdForDueDateEdition('');
                        setIsCalandar(false);
                      }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div>
            <button className="todo_btn_add" type="button" onClick={() => setIsAddTodo(true)}>
              + Todo
            </button>
            {isAddTodo ? <TodoAdd scheduleId={scheduleId} setIsAddTodo={setIsAddTodo} setChange={setChange} /> : <></>}
          </div>
        </div>
      </div>
    </>
  );
}
