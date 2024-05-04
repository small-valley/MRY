import { useState, useEffect, useCallback } from 'react';
import { GetNotificationResponse } from '../../../../shared/models/responses/getNotificationResponse';
import { getNotificationBySender } from '@/app/actions/notifications';
import { GetNotificationBySenderRequest } from '../../../../shared/models/requests/getNotificationBySenderRequest';

const useNotificationSender = (id: string) => {
  const [notiListSender, setNotiListSender] = useState<GetNotificationResponse[]>();

  const fetchNotiListSender = useCallback(async () => {
    const setId: GetNotificationBySenderRequest = {
      senderId: id,
    };
    const noti = await getNotificationBySender(setId);
    setNotiListSender(noti);
  }, []);

  useEffect(() => {
    fetchNotiListSender();
  }, [fetchNotiListSender]);

  return { notiListSender, fetchNotiListSender };
};

export default useNotificationSender;
