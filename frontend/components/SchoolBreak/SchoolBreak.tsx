import useSchoolBreak from '@/app/hooks/schoolbreak/useSchoolBreak';
import { useEffect, useState } from 'react';
import { GetSchoolBreaksResponse } from '../../../shared/models/responses/getSchoolBreaksResponse';
import { changeDate, changeSchoolBreakDate } from '@/app/actions/common';
import { Plus } from 'lucide-react';
import Calendar from 'react-calendar';
import { PostSchoolBreakRequest } from '../../../shared/models/requests/postSchoolBreakRequest';
import { createSchoolBreak, deleteSchoolBreak } from '@/app/actions/schoolbreak';

const BASE_CLASS = 'home_dashboard_schoolbreak';

export default function SchoolBreak() {
  const { breaks, fetchBreaks } = useSchoolBreak();
  const [schoolBreaksYear, setSchoolBreakYear] = useState<GetSchoolBreaksResponse[]>();
  const [isCalandar, setIsCalandar] = useState<boolean>(false);
  const [newStartDate, setNewStartDate] = useState<Date>();
  const [newEndDate, setNewEndDate] = useState<Date>();
  const [isNew, setIsNew] = useState<number>(0);
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string>('');

  const today = new Date();
  const currentYear = today.getFullYear();

  useEffect(() => {
    if (!breaks) {
      return;
    }
    const tmpBreak = breaks.filter((item) => {
      const startDate = new Date(item.startDate);
      return startDate.getFullYear() === currentYear;
    });
    setSchoolBreakYear(tmpBreak);
  }, [breaks]);

  useEffect(() => {
    fetchBreaks();
  }, [isNew]);

  const updateDate = (event: any) => {
    setNewStartDate(event[0]);
    setNewEndDate(event[1]);
  };

  const handelSaveBreak = async (formData: any) => {
    if (newStartDate && newEndDate) {
      const tmpBreak: PostSchoolBreakRequest = {
        name: formData.get('title'),
        startDate: typeof newStartDate === 'string' ? newStartDate : newStartDate.toDateString(),
        endDate: typeof newEndDate === 'string' ? newEndDate : newEndDate.toDateString(),
      };

      try {
        const sucess = await createSchoolBreak(tmpBreak);
        if (sucess) {
          setIsNew(Math.random());
        }
      } catch (error: any) {
        console.log('error');
      }
    }
    setIsCalandar(false);
  };

  const handleDeleteBreak = async () => {
    try {
      const sucess = await deleteSchoolBreak(deleteId);
      if (sucess) {
        setIsNew(Math.random());
        setDeleteId('');
        setIsDelete(false);
      }
    } catch (error: any) {
      console.log(error);
    }

    setIsCalandar(false);
  };

  const tileDisabled = ({ date, view }: any) => {
    if (view === 'month') {
      const dayOfWeek = date.getDay();
      if (
        dayOfWeek === 2 || // Tuesday
        dayOfWeek === 3 || // Wednesday
        dayOfWeek === 4 || // Thursday
        dayOfWeek === 6 || // Saturday
        dayOfWeek === 0 // Sunday
      ) {
        return true;
      }

      if (breaks) {
        for (const tmpbreak of breaks) {
          const startDate = new Date(tmpbreak.startDate);
          const endDate = new Date(tmpbreak.endDate);
          if (date >= startDate && date <= endDate) {
            return true; // Disable dates within school breaks
          }
        }
      }
    }
    return false;
  };

  return (
    <div className={BASE_CLASS}>
      <div className={`${BASE_CLASS}_title`}>
        <h2>{currentYear} School Break</h2>
        <button
          className="dashboard_btn_addbreak"
          onClick={() => {
            setIsCalandar(true);
          }}
        >
          <Plus size={15} />
        </button>
      </div>
      <div className={`${BASE_CLASS}_list`}>
        {schoolBreaksYear &&
          schoolBreaksYear.map((breakItem, index) => (
            <li
              key={`${breakItem.id}-${index}-${breakItem.startDate}`}
              onClick={() => {
                setIsDelete(true);
                setDeleteId(breakItem.id);
              }}
            >
              <h3>{breakItem.name}</h3>
              <div>
                {changeSchoolBreakDate(breakItem.startDate)} - {changeSchoolBreakDate(breakItem.endDate)}
              </div>
            </li>
          ))}
      </div>
      <div className={`calender_popup ${isCalandar ? 'calender_popup_selected' : ''}`}>
        <form className="calender_popup_selected_wrap" action={handelSaveBreak}>
          <h2> Select Date</h2>
          <div className="calender_popup_selected_wrap_btn">
            <label>Break Name</label>
            <input name="title" type="text" required />
          </div>
          <Calendar onChange={updateDate} selectRange={true} tileDisabled={tileDisabled} />
          <div className="calender_popup_selected_wrap_btn">
            <button className="close" type="submit">
              Save
            </button>
            <button
              className="close"
              type="button"
              onClick={() => {
                setIsCalandar(false);
              }}
            >
              Close
            </button>
          </div>
        </form>
      </div>
      <div className={`init_popup ${isDelete ? 'break_delete' : ''}`}>
        <div className="break_delete_wrap">
          <h3>Are you sure you want to delete Break? </h3>
          <div className="break_delete_wrap_btn">
            <button className="dashboard_btn_del" onClick={handleDeleteBreak}>
              Delete
            </button>
            <button
              className="dashboard_btn_del"
              onClick={() => {
                setIsDelete(false);
                setDeleteId('');
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
