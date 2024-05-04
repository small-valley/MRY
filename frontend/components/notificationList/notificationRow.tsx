import { useState } from 'react';
import { GetNotificationResponse } from '../../../shared/models/responses/getNotificationResponse';

type Props = {
  noti: GetNotificationResponse;
  revalidateNoti: () => void;
};

const BASE_CLASS = 'notification_list';

export default function NotificationRow({ noti, revalidateNoti }: Props) {
  const [selectedId, setSelectedId] = useState<string>('');

  const toggleSelectedId = (id: string) => {
    if (selectedId === '' || selectedId != id) {
      setSelectedId(id);
    } else {
      setSelectedId('');
    }
  };

  interface OnApproveInterface {
    notificationId: string;
    type: string;
  }

  const onApprove =
    ({ notificationId, type }: OnApproveInterface) =>
    async () => {
      const options = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      };
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/notifications/${notificationId}?isApproved=true`, options);
        if (type === 'vacation') {
          await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/userDayoffs/${noti.userDayoffId}`, options);
        } else if (type === 'day') {
          await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/userCapabilityDays/${noti.userCapabilityDayId}`,
            options
          );
        } else if (type === 'time') {
          await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/userCapabilityTimes/${noti.userCapabilityTimeId}`,
            options
          );
        } else if (type === 'course') {
          await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/userCapabilityCourses/${noti.userCapabilityCourseId}`,
            options
          );
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        revalidateNoti();
      }
      setSelectedId('');
    };

  const onDisapprove = (notificationId: string) => async () => {
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/notifications/${notificationId}?isApproved=false`, options);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      revalidateNoti();
    }
    setSelectedId('');
  };

  return (
    <li id={`${noti.id}-${noti.title}`} onClick={() => toggleSelectedId(noti.id)}>
      {noti.type === 'vacation' && (
        <div className={`${BASE_CLASS}_row vacation ${noti.isRead ? 'checked' : ''}`}>
          <div className={`${BASE_CLASS}_row_title`}>
            <p> {noti.title}</p>
            <p> Requester : {noti.sender?.firstName}</p>
          </div>
          <div className={`${BASE_CLASS}_row_detail ${selectedId === noti.id ? 'selected' : ''}`}>
            <label>Date : {noti.createdAt?.toString()?.split('T')[0]}</label>
            <p>{noti.description}</p>
            {!noti.isRead ? (
              <div className={`selected_btn`}>
                <button
                  type="button"
                  className="approve"
                  onClick={onApprove({ notificationId: noti.id, type: noti.type })}
                >
                  Approve
                </button>
                <button type="button" className="disapprove" onClick={onDisapprove(noti.id)}>
                  Reject
                </button>
              </div>
            ) : (
              <div className={`selected_btn`}>
                {noti.isApproved ? <div className="approve">Approved</div> : <div className="disapprove">Rejected</div>}
              </div>
            )}
          </div>
        </div>
      )}
      {noti.type === 'day' && (
        <div className={`${BASE_CLASS}_row changeinfo ${noti.isRead ? 'checked' : ''}`}>
          <div className={`${BASE_CLASS}_row_title`}>
            <p> {noti.title}</p>
            <p> Requester : {noti.sender?.firstName}</p>
          </div>
          <div className={`${BASE_CLASS}_row_detail ${selectedId === noti.id ? 'selected' : ''}`}>
            <label>Date : {noti.createdAt?.toString()?.split('T')[0]}</label>
            <p> {noti.description}</p>
            {!noti.isRead ? (
              <div className={`selected_btn`}>
                <button
                  type="button"
                  className="approve"
                  onClick={onApprove({ notificationId: noti.id, type: noti.type })}
                >
                  Approve
                </button>
                <button type="button" className="disapprove" onClick={onDisapprove(noti.id)}>
                  Reject
                </button>
              </div>
            ) : (
              <div className={`selected_btn`}>
                {noti.isApproved ? <div className="approve">Approved</div> : <div className="disapprove">Rejected</div>}
              </div>
            )}
          </div>
        </div>
      )}
      {noti.type === 'time' && (
        <div className={`${BASE_CLASS}_row changeinfo ${noti.isRead ? 'checked' : ''}`}>
          <div className={`${BASE_CLASS}_row_title`}>
            <p> {noti.title}</p>
            <p> Requester : {noti.sender?.firstName}</p>
          </div>
          <div className={`${BASE_CLASS}_row_detail ${selectedId === noti.id ? 'selected' : ''}`}>
            <label>Date : {noti.createdAt?.toString()?.split('T')[0]}</label>
            <p> {noti.description}</p>
            {!noti.isRead ? (
              <div className={`selected_btn`}>
                <button
                  type="button"
                  className="approve"
                  onClick={onApprove({ notificationId: noti.id, type: noti.type })}
                >
                  Approve
                </button>
                <button type="button" className="disapprove" onClick={onDisapprove(noti.id)}>
                  Reject
                </button>
              </div>
            ) : (
              <div className={`selected_btn`}>
                {noti.isApproved ? <div className="approve">Approved</div> : <div className="disapprove">Rejected</div>}
              </div>
            )}
          </div>
        </div>
      )}
      {noti.type === 'course' && (
        <div className={`${BASE_CLASS}_row changeinfo ${noti.isRead ? 'checked' : ''}`}>
          <div className={`${BASE_CLASS}_row_title`}>
            <p> {noti.title}</p>
            <p> Requester : {noti.sender?.firstName}</p>
          </div>
          <div className={`${BASE_CLASS}_row_detail ${selectedId === noti.id ? 'selected' : ''}`}>
            <label>Date : {noti.createdAt?.toString()?.split('T')[0]}</label>
            <p> {noti.description}</p>
            {!noti.isRead ? (
              <div className={`selected_btn`}>
                <button
                  type="button"
                  className="approve"
                  onClick={onApprove({ notificationId: noti.id, type: noti.type })}
                >
                  Approve
                </button>
                <button type="button" className="disapprove" onClick={onDisapprove(noti.id)}>
                  Reject
                </button>
              </div>
            ) : (
              <div className={`selected_btn`}>
                {noti.isApproved ? <div className="approve">Approved</div> : <div className="disapprove">Rejected</div>}
              </div>
            )}
          </div>
        </div>
      )}
      {noti.type === 'message' && (
        <div className={`${BASE_CLASS}_row message ${noti.isRead ? 'checked' : ''}`}>
          <div className={`${BASE_CLASS}_row_title`}>
            <p> {noti.title}</p>
            <p> Requester : {noti.sender?.firstName}</p>
          </div>
          <div className={`${BASE_CLASS}_row_detail ${selectedId === noti.id ? 'selected' : ''}`}>
            <label>Date : {noti.createdAt?.toString()?.split('T')[0]}</label>
            <p> {noti.description}</p>
            {!noti.isRead ? (
              <div className={`selected_btn`}>
                <button
                  type="button"
                  className="approve"
                  onClick={onApprove({ notificationId: noti.id, type: noti.type })}
                >
                  Confirm
                </button>
              </div>
            ) : (
              <div className={`selected_btn`}>
                <div className="approve">Confirmed</div>
              </div>
            )}
          </div>
        </div>
      )}
    </li>
  );
}
