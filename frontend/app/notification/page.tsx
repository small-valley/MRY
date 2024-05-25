'use client';

import NotificationRow from '@/components/notificationList/notificationRow';
import { useState } from 'react';
import useSWR from 'swr';
import { BaseResponse } from '../../../shared/models/responses/baseResponse';
import { GetNotificationResponse } from '../../../shared/models/responses/getNotificationResponse';
import { getAccessToken } from '../actions/common';
import { useCurrentUserContext } from '../contexts/CurrentUserContext';
import './notification.scss';
import useNotifications from '../hooks/instructors/useNotifications';

const BASE_CLASS = 'notification';

export interface Notification {
  id: string;
  type: string;
  title: string;
  receiverId: string;
}

export default function Notification() {
  const [type, setType] = useState<string>('');
  const { currentUser } = useCurrentUserContext();
  const receiverId = currentUser?.userId;
  const { notifications, fetchNotifications } = useNotifications(type, receiverId);

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
          ? notifications.map((noti) => <NotificationRow key={noti.id} noti={noti} revalidateNoti={fetchNotifications} />)
          : null}
      </div>
    </div>
  );
}
