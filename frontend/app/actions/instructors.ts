import { GetInstructorResponse } from '../../../shared/models/responses/getInstructorResponse';
import { PostUserDayoffRequest } from '../../../shared/models/requests/postUserDayoffRequest';
import { GetUserDayoffsResponse } from '../../../shared/models/responses/getUserDayoffsResponse';
import { PostUserDayoffsResponse } from '../../../shared/models/responses/postUserDayoffResponse';

export const getInstructor = async (): Promise<GetInstructorResponse[]> => {
  try {
    const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/users`;

    const response = await fetch(baseUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
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

//need return type
export const getManager = async (): Promise<[]> => {
  try {
    const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/managers`;

    const response = await fetch(baseUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
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

export const getInstructorById = async (id: string): Promise<GetInstructorResponse> => {
  try {
    const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${id}`;

    const response = await fetch(baseUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
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

// need return data Type
export const getVacation = async (id: string): Promise<GetUserDayoffsResponse[]> => {
  try {
    const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/userDayoffs/${id}`;

    const response = await fetch(baseUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
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

export const createVacation = async (dayoff: PostUserDayoffRequest): Promise<PostUserDayoffsResponse> => {
  try {
    const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/userDayoffs`;

    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dayoff),
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
