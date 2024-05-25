import { Check, X } from 'lucide-react';
import { useState } from 'react';

//import shared model Fetch Type
import { PostCourseRequest } from '../../../shared/models/requests/postProgramRequest';

//function, type
import { createCourse } from '@/app/actions/programs';
import { colors, setChange, setIsAdd } from '@/type/programs';

const BASE_CLASS = 'program_content_wrap';
const BTN_BASE_CLASS = 'program_btn';
type Props = {
  setIsAdd: setIsAdd;
  setChange: setChange;
  setMessage: (message: string) => void;
  programId: string;
};

export default function CourseAdd({ setIsAdd, setChange, setMessage, programId }: Props) {
  const [title, setTitle] = useState<string>('');
  const [hour, setHour] = useState<number>(0);

  const handleCreateCourse = async (formData: any) => {
    const newCourse: PostCourseRequest = {
      id: programId,
      courses: { name: formData.get('title'), hour: formData.get('hour'), color: formData.get('color') },
    };

    try {
      const success = await createCourse(newCourse);
      if (success) {
        setIsAdd(false);
        setChange(Math.random());
      }
    } catch (error: any) {
      setIsAdd(false);
      setChange(Math.random());
      setMessage('The Course can not create');
      setTimeout(() => {
        setMessage('');
      }, 4000);
    }
  };

  return (
    <>
      <form className={`${BASE_CLASS}_course_row_add`} action={handleCreateCourse}>
        <input
          name="title"
          type="text"
          placeholder="course title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required={true}
        />
        <input
          name="hour"
          type="number"
          placeholder="hours"
          min={0}
          max={300}
          value={hour}
          onChange={(event) => setHour(event.target.valueAsNumber)}
          required={true}
        />
        <select name="color">
          {colors.map((color, index) => (
            <>
              {index === 0 ? (
                <>
                  <option value={color} key={index} selected>
                    {color}
                  </option>
                </>
              ) : (
                <>
                  <option value={color} key={index}>
                    {color}
                  </option>
                </>
              )}
            </>
          ))}
        </select>
        <button className={`${BTN_BASE_CLASS}_courseadd`} type="submit">
          <Check size={15} />
        </button>
        <button className={`${BTN_BASE_CLASS}_courseadd`} type="button" onClick={() => setIsAdd(false)}>
          <X size={15} />
        </button>
      </form>
    </>
  );
}
