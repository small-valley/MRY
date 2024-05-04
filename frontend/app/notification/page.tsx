'use client';

import { useState } from 'react';
import useSWR from 'swr';
import NotificationRow from '@/components/notificationList/notificationRow';
import './notification.scss';
import { BaseResponse } from '../../../shared/models/responses/baseResponse';
import { GetNotificationResponse } from '../../../shared/models/responses/getNotificationResponse';

const BASE_CLASS = 'notification';

export interface Notification {
  id: string;
  type: string;
  title: string;
  receiverId: string;
}

export default function Notification() {
  const [type, setType] = useState<string>('');

  const receiverId = 'e20a109d-251e-4be1-a4a6-d58053de0b28'; // Set Rodrigo's ID
  const baseURL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/notifications?receiverId=${receiverId}${
    type && `&type=${type}`
  }`;
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data, mutate } = useSWR<BaseResponse<GetNotificationResponse[]>>(baseURL, fetcher);

  const notifications = data?.data;

  const onChangeType = (newType: string) => {
    type === newType ? setType('') : setType(newType);
  };

  return (
    <div className={BASE_CLASS}>
      <div className={`${BASE_CLASS}_checkbox`}>
        <input
          type="checkbox"
          id="vacation"
          name="vacation"
          onChange={() => onChangeType('vacation')}
          checked={type === 'vacation'}
        />
        <div>Vacation</div>
        <input type="checkbox" id="day" name="day" onChange={() => onChangeType('day')} checked={type === 'day'} />
        <div>Day Approval</div>
        <input type="checkbox" id="time" name="time" onChange={() => onChangeType('time')} checked={type === 'time'} />
        <div>Period Approval</div>
        <input
          type="checkbox"
          id="course"
          name="course"
          onChange={() => onChangeType('course')}
          checked={type === 'course'}
        />
        <div>Course Approval</div>
        <input
          type="checkbox"
          id="message"
          name="message"
          onChange={() => onChangeType('message')}
          checked={type === 'message'}
        />
        <div>Message</div>
      </div>
      <div className={`${BASE_CLASS}_list`}>
        {notifications
          ? notifications.map((noti) => <NotificationRow key={noti.id} noti={noti} revalidateNoti={mutate} />)
          : null}
      </div>
    </div>
  );
}
