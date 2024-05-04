import { PostNotificationRequest } from '../../../shared/models/requests/postNotificationRequest';
import { GetNotificationBySenderRequest } from '../../../shared/models/requests/getNotificationBySenderRequest';

import { GetNotificationResponse } from '../../../shared/models/responses/getNotificationResponse';

export const createNotification = async (noti: PostNotificationRequest) => {
  try {
    const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/notifications`;

    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(noti),
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

export const getNotificationBySender = async (
  sender: GetNotificationBySenderRequest
): Promise<GetNotificationResponse[]> => {
  try {
    const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/notifications/sender?senderId=${sender.senderId}`;

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

    console.log(data);
    return data.data;
  } catch (error: any) {
    console.error(error);
    throw new Error(`An error occurred: ${error.message}`);
  }
};
