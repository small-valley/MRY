import { Check, X } from 'lucide-react';
import { useState } from 'react';
//import shared model Fetch Type
import { PostProgramRequest } from '../../../shared/models/requests/postProgramRequest';

//function, type
import { createProgram } from '@/app/actions/programs';
import { colors, setChange, setIsAdd } from '@/type/programs';

const BASE_CLASS = 'program_content_wrap';
const BTN_BASE_CLASS = 'program_btn';

type Props = {
  setChange: setChange;
  setIsAdd: setIsAdd;
};
export default function ProgramAdd({ setChange, setIsAdd }: Props) {
  const [program, setProgram] = useState<string>('');
  const [course, setCourse] = useState<string>('');
  const [hour, setHour] = useState<number>(0);
  const [message, setMessage] = useState<string>('');

  const handleCreateProgram = async (formData: any) => {
    const newProgram: PostProgramRequest = {
      name: program,
      courses: [{ name: course, hour: hour, color: formData.get('color') }],
    };
    try {
      const success = await createProgram(newProgram);
      if (success) {
        setIsAdd(false);
        setChange(Math.random());
      }
    } catch (error: any) {
      setMessage('The Program can not create');
      setTimeout(() => {
        setMessage('');
      }, 4000);
    }
  };
  return (
    <>
      <form action={handleCreateProgram}>
        <div className={`${BASE_CLASS}_newprogram`}>
          <input
            name="title"
            type="text"
            placeholder="Program Name"
            value={program}
            onChange={(event) => setProgram(event.target.value)}
            required={true}
          />
        </div>
        <div className={`${BASE_CLASS}_newcourse`}>
          <input
            name="title"
            type="text"
            placeholder="Course Name"
            value={course}
            onChange={(event) => setCourse(event.target.value)}
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
                    <option value={color} key={`${index}-${Math.random()}`} selected>
                      {color}
                    </option>
                  </>
                ) : (
                  <>
                    <option value={color} key={`${index}-${Math.random()}`}>
                      {color}
                    </option>
                  </>
                )}
              </>
            ))}
          </select>
          <button className={`${BTN_BASE_CLASS}_add`} type="submit">
            <Check size={15} />
          </button>
          <button
            className={`${BTN_BASE_CLASS}_del`}
            type="button"
            onClick={() => {
              setIsAdd(false);
            }}
          >
            <X size={15}></X>
          </button>
          <div className="message">{message}</div>
        </div>
      </form>
    </>
  );
}
