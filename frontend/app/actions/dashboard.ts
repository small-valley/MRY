import { GetDashboardResponse } from '../../../shared/models/responses/getDashboardResponse';
import { getAccessToken } from './common';

export const getDashboard = async (): Promise<GetDashboardResponse> => {
  try {
    const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL_D}/dashboard`;

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
