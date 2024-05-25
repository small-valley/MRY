import { PostUserDayoffRequest } from '../../../shared/models/requests/postUserDayoffRequest';
import { GetInstructorResponse } from '../../../shared/models/responses/getInstructorResponse';
import { GetUserDayoffsResponse } from '../../../shared/models/responses/getUserDayoffsResponse';
import { PostUserDayoffsResponse } from '../../../shared/models/responses/postUserDayoffResponse';
import { getAccessToken } from './common';

export const getInstructor = async (): Promise<GetInstructorResponse[]> => {
  try {
    const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL_A}/users`;

    const response = await fetch(baseUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
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
    const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL_A}/users/managers`;

    const response = await fetch(baseUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
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
    const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL_A}/users/${id}`;

    const response = await fetch(baseUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
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
    const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL_C}/userDayoffs/${id}`;

    const response = await fetch(baseUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
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
    const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL_C}/userDayoffs`;

    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
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
