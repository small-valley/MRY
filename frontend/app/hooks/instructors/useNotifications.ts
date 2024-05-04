import { BaseResponse } from '../../../../shared/models/responses/baseResponse';
import { getAccessToken } from '@/app/actions/common';
import useSWR from 'swr';
import { GetNotificationResponse } from "../../../../shared/models/responses/getNotificationResponse";

const useNotifications = (type: string, receiverId: string | undefined) => {
  const baseURL = `${process.env.NEXT_PUBLIC_API_BASE_URL_B}/notifications${receiverId && `?receiverId=${receiverId}`}${type && `&type=${type}`
    }`;
  const fetcher = (url: string) =>
    fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
        'Content-Type': 'application/json',
      },
    }).then((res) => res.json());

  const { data, mutate } = useSWR<BaseResponse<GetNotificationResponse[]>>(baseURL, fetcher);

  const notifications = data?.data;

  return { notifications: notifications, fetchNotifications: mutate };
};

export default useNotifications;
