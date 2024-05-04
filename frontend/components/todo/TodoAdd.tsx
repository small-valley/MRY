import { postApiData } from '@/app/actions/common';
import { useState } from 'react';
import Calendar from 'react-calendar';
import { PostTodoRequest } from '../../../shared/models/requests/postTodoRequest';
import './todo.scss';

export default function TodoAdd({
  scheduleId,
  setIsAddTodo,
  setChange,
}: {
  scheduleId: string;
  setIsAddTodo: (isAddTodo: boolean) => void;
  setChange: (random: number) => void;
}) {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState<Date>();

  const handleAddTodo = async () => {
    const response = await postApiData<PostTodoRequest, null>(`${process.env.NEXT_PUBLIC_API_BASE_URL_B}/todos`, {
      scheduleId: scheduleId,
      title: title,
      description: title,
      dueDate: dueDate ?? new Date(),
    });
    setChange(Math.random());
  };

  const handleDateChange = (event: any) => {
    setDueDate(event);
  };

  return (
    <div>
      <div className={`todocalender_popup todocalender_popup_selected`}>
        <div className="todocalender_popup_selected_wrap">
          <h2> Select Due Date</h2>
          <Calendar onChange={handleDateChange} selectRange={false} />
          <form
            className="todocalender_popup_selected_wrap_form"
            action={() => {
              handleAddTodo();
              setIsAddTodo(false);
            }}
          >
            <input
              name="title"
              type="text"
              placeholder="Todo Title"
              onChange={(event) => setTitle(event.target.value)}
              required={true}
            />
            <button className="close" type="submit">
              Add
            </button>
            <button className="close" onClick={() => setIsAddTodo(false)}>
              Close
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
