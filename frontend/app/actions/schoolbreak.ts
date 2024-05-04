import { PostSchoolBreakRequest } from '../../../shared/models/requests/postSchoolBreakRequest';
import { GetSchoolBreaksResponse } from '../../../shared/models/responses/getSchoolBreaksResponse';
import { getAccessToken } from './common';

export const getSchoolBreak = async (): Promise<GetSchoolBreaksResponse[]> => {
  try {
    const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL_D}/school-breaks`;

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

export const createSchoolBreak = async (newbreak: PostSchoolBreakRequest) => {
  try {
    const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL_D}/school-breaks`;

    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newbreak),
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

export const deleteSchoolBreak = async (id: string) => {
  try {
    const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL_D}/school-breaks/${id}`;

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
