import { Check, Plus, Trash2, X } from 'lucide-react';
import { Dispatch, SetStateAction, useState } from 'react';
//import shared model Fetch Type
import { PutProgramRequest } from '../../../shared/models/requests/putProgramRequest';
import { GetProgramResponse } from '../../../shared/models/responses/getProgramResponse';
//function, type
import { deleteProgram, updatePrograms } from '@/app/actions/programs';
//use component
import CourseAdd from './CourseAdd';
import CourseShow from './CourseShow';

type Props = {
  program: GetProgramResponse;
  setChange: Dispatch<SetStateAction<number>>;
};
const BASE_CLASS = 'program_content_wrap';
const BTN_BASE_CLASS = 'program_btn';

export default function ProgramShow({ program, setChange }: Props) {
  const [message, setMessage] = useState<string>('');

  const [isClick, setClick] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [title, setTitle] = useState<string>(program.name);
  const [isAdd, setIsAdd] = useState(false);
  const totalHour = getHour();

  function getHour() {
    let tmphour = 0;
    program.courses.forEach((course) => {
      tmphour += course.hour;
    });
    return tmphour;
  }
  const handleUpdateProgram = async (formData: any) => {
    const updateProgram: PutProgramRequest = {
      id: program.id,
      name: formData.get('title'),
    };
    if (updateProgram.name == program.name) {
      setClick(false);
    } else {
      try {
        const success = await updatePrograms(updateProgram);
        if (success) {
          setClick(false);
          setIsDelete(false);
          setChange(Math.random());
        }
      } catch (error: any) {
        setClick(false);
        setIsDelete(false);
        setChange(Math.random());
        setMessage('The Program can not update');
        setTimeout(() => {
          setMessage('');
        }, 4000);
      }
    }
  };

  const handleDeleteProgram = async () => {
    try {
      const success = await deleteProgram(program.id);
      if (success) {
        setClick(false);
        setChange(Math.random());
      }
    } catch (error: any) {
      setClick(false);
      setMessage('the Program can not delete');
      setTimeout(() => {
        setMessage('');
      }, 4000);
    }
  };
  return (
    <>
      <ul className={`${BASE_CLASS}_course`}>
        <div className={`${BASE_CLASS}_header`}>
          <li onClick={() => setClick(true)}>
            <h2>
              {program.name} Total Hour : {totalHour}h
            </h2>
          </li>
          {isClick ? (
            <>
              {isDelete ? (
                <>
                  <form className={`${BASE_CLASS}_course_row_del`} action={handleDeleteProgram}>
                    <div> Confirm Delete {program.name} ?</div>
                    <button type="submit" className={`${BTN_BASE_CLASS}_del`}>
                      <Trash2 size={15} />
                    </button>
                    <button className={`${BTN_BASE_CLASS}_del`} type="button" onClick={() => setIsDelete(false)}>
                      <X size={15} />
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <form className={`${BASE_CLASS}_header_edit`} action={handleUpdateProgram}>
                    <input
                      name="title"
                      type="text"
                      placeholder="course title"
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                      required={true}
                    />
                    <button className={`${BTN_BASE_CLASS}_save`} type="submit">
                      <Check size={15} />
                    </button>
                    <button className={`${BTN_BASE_CLASS}_del`} type="button" onClick={() => setIsDelete(true)}>
                      <Trash2 size={15} />
                    </button>
                  </form>
                </>
              )}
            </>
          ) : (
            <></>
          )}
        </div>

        {program.courses.map(
          (course) =>
            course.name != 'Break' && (
              <CourseShow key={course.id} course={course} setChange={setChange} setMessage={setMessage} />
            )
        )}
        <div className={`${BASE_CLASS}_course_row`}>
          {isAdd ? (
            <CourseAdd setIsAdd={setIsAdd} setChange={setChange} setMessage={setMessage} programId={program.id} />
          ) : (
            <>
              <button className={`${BTN_BASE_CLASS}_newcourse`} type="button" onClick={() => setIsAdd(true)}>
                <Plus size={15} />
              </button>
            </>
          )}
        </div>
        <div className="message">{message}</div>
      </ul>
    </>
  );
}
