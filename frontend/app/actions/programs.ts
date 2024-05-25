// HACK: server action (including revalidatePath) is not supported in S3 deployment (static site generation)
//'use server';
import { PostCourseRequest, PostProgramRequest } from '../../../shared/models/requests/postProgramRequest';
import { PutCourseRequest, PutProgramRequest } from '../../../shared/models/requests/putProgramRequest';
import { GetProgramResponse } from '../../../shared/models/responses/getProgramResponse';
import { getAccessToken } from './common';

export const getPrograms = async (): Promise<GetProgramResponse[]> => {
  try {
    const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL_E}/programs`;

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

export const updatePrograms = async (program: PutProgramRequest) => {
  try {
    const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL_E}/programs`;

    const response = await fetch(baseUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(program),
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return true;
  } catch (error: any) {
    console.error(error);
    throw new Error(`An error occurred: ${error.message}`);
  }
};

export const updateCourse = async (course: PutCourseRequest) => {
  try {
    const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL_E}/programs/courses`;
    const response = await fetch(baseUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(course),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return true;
  } catch (error: any) {
    console.error(error);
    throw new Error(`An error occurred: ${error.message}`);
  }
};

export const createProgram = async (program: PostProgramRequest) => {
  try {
    const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL_E}/programs`;

    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(program),
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    return true;
  } catch (error: any) {
    console.error(error);
    throw new Error(`An error occurred: ${error.message}`);
  }
};

export const createCourse = async (course: PostCourseRequest) => {
  try {
    const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL_E}/programs/courses`;

    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(course),
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    return true;
  } catch (error: any) {
    console.error(error);
    throw new Error(`An error occurred: ${error.message}`);
  }
};

export const deleteCourse = async (id: string) => {
  try {
    const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL_E}/programs/courses/${id}`;

    const response = await fetch(baseUrl, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return true;
  } catch (error: any) {
    console.error(error);
    throw new Error(`An error occurred: ${error.message}`);
  }
};

export const deleteProgram = async (id: string) => {
  try {
    const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL_E}/programs/${id}`;

    const response = await fetch(baseUrl, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return true;
  } catch (error: any) {
    console.error(error);
    throw new Error(`An error occurred: ${error.message}`);
  }
};
