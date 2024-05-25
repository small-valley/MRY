import { changeDate } from '@/app/actions/common';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import './InstructorDetail.scss';
import { PostNotificationRequest } from '../../../shared/models/requests/postNotificationRequest';
import { createNotification } from '@/app/actions/notifications';
import { PostUserDayoffRequest } from '../../../shared/models/requests/postUserDayoffRequest';
import { createVacation, getVacation } from '@/app/actions/instructors';
import { GetUserDayoffsResponse } from '../../../shared/models/responses/getUserDayoffsResponse';
import { PostUserDayoffsResponse } from '../../../shared/models/responses/postUserDayoffResponse';
import useManagerId from '@/app/hooks/instructors/useManagerId';
import { useCurrentUserContext } from '@/app/contexts/CurrentUserContext';

const BASE_CLASS = 'vacationcard_content';
type Props = {
  id: string;
};

export default function InstructorVacation({ id }: Props) {
  const currentRouter = usePathname();
  const [startDate, setStartdate] = useState<Date>(new Date());
  const [endDate, setEnddate] = useState<Date>(new Date());
  const [message, setMessage] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [vacationList, setVacationList] = useState<GetUserDayoffsResponse[]>([]);
  const [newDayOffId, setNewDayOffId] = useState<PostUserDayoffsResponse>();
  const { receiverId } = useManagerId();
  const { currentUser } = useCurrentUserContext();
  const isManager = currentUser?.role === 'manager';

  const handleDateChange = (event: any) => {
    setIsOpen(false);
    setStartdate(event[0]);
    setEnddate(event[1]);
    setIsSubmit(true);
  };

  const fetchVacation = useCallback(async (id: string) => {
    try {
      const vacation = await getVacation(id);
      setVacationList(vacation);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);

  useEffect(() => {
    fetchVacation(id);
  }, [id]);

  useEffect(() => {
    if (!isManager) {
      handleCreateNotificaiotn(id);
    }
    setIsSubmit(false);

    setTimeout(() => {
      setMessage('');
    }, 5000);
  }, [newDayOffId]);

  const handleAddVacation = async (id: string) => {
    const newVacation: PostUserDayoffRequest = {
      userId: id,
      startDate: startDate,
      endDate: endDate,
      isDraft: isManager ? false : true,
    };
    try {
      const vacationId = await createVacation(newVacation);
      setNewDayOffId(vacationId);
    } catch (error: any) {
      console.log(error);
    } finally {
      if (isManager) {
        fetchVacation(id);
      }
    }
  };

  const handleCreateNotificaiotn = async (id: string) => {
    if (!newDayOffId || !receiverId) return;
    const newNoti: PostNotificationRequest = {
      senderId: id,
      title: 'Confirm Vacation',
      type: 'vacation',
      receiverId: receiverId,
      userDayoffId: newDayOffId.userDayoffId,
    };

    try {
      const success = await createNotification(newNoti);
      if (success) {
        fetchVacation(id);
        setMessage('The Vacation will be added after approve from manager');
      }
    } catch (error: any) {
      setMessage(error);
    }
  };

  return (
    <>
      <div className={BASE_CLASS}>
        <h3>Vacation</h3>

        {vacationList.map((vacation, index) => (
          <li key={`${index}-${vacation.id}-${vacation.startDate}`}>
            <label>
              {changeDate(vacation.startDate)} to {changeDate(vacation.endDate)}
            </label>
            <div className={vacation.isDraft ? 'Wait' : 'Approved'}>{vacation.isDraft ? 'Wait' : 'Approved'}</div>
          </li>
        ))}

        {currentRouter.includes('/profile') && (
          <button
            className="instructors_btn_finishedit"
            type="button"
            onClick={() => {
              setIsOpen(true);
            }}
          >
            Add Vacation
          </button>
        )}
      </div>

      <div className="message">{message}</div>
      <div className={`calender_popup ${isOpen ? 'calender_popup_selected' : ''}`}>
        <div className="calender_popup_selected_wrap">
          <h2> Select Date</h2>
          <Calendar onChange={handleDateChange} minDate={new Date()} value={[startDate, endDate]} selectRange={true} />
          <button className="close" onClick={() => setIsOpen(false)}>
            Close
          </button>
        </div>
      </div>
      <div className={`submit_popup ${isSubmit ? 'submit_popup_selected' : ''}`}>
        <div className="submit_popup_selected_wrap">
          <h3>New Vacation </h3>
          <div>
            {changeDate(startDate)} - {changeDate(endDate)}
          </div>
          <div className="submit_btn">
            <button
              className="instructors_btn_finishedit"
              onClick={() => {
                handleAddVacation(id);
              }}
            >
              Send
            </button>
            <button
              className="instructors_btn_finishedit"
              onClick={() => {
                setIsSubmit(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
