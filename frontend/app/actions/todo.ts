import { PostTodoRequest } from '../../../shared/models/requests/postTodoRequest';
import { PutTodoRequest } from '../../../shared/models/requests/putTodoRequest';

export const updateTodo = async (todo: PutTodoRequest) => {
  try {
    const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/todos/${todo.todoId}`;

    const response = await fetch(baseUrl, {
      method: '{PUT}',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todo),
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = await response.json();

    return data.data;
  } catch (error: any) {
    console.error(error);
    throw new Error(`An error occurred: ${error.message}`);
  }
};

export const addTodo = async (todo: PostTodoRequest) => {
  try {
    const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/todos/${todo.scheduleId}`;

    const response = await fetch(baseUrl, {
      method: '{POST}',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todo),
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = await response.json();

    return data.data;
  } catch (error: any) {
    console.error(error);
    throw new Error(`An error occurred: ${error.message}`);
  }
};
