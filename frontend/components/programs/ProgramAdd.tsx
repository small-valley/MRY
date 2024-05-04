import { Check } from 'lucide-react';
import { useState } from 'react';
//import shared model Fetch Type
import { PostProgramRequest } from '../../../shared/models/requests/postProgramRequest';

//function, type
import { createProgram } from '@/app/actions/programs';
import { colors, setChange, setIsAdd } from '@/type/programs';

const BASE_CLASS = 'program_content_wrap';

type Props = {
  setChange: setChange;
  setIsAdd: setIsAdd;
};
export default function ProgramAdd({ setChange, setIsAdd }: Props) {
  const [program, setProgram] = useState<string>('');
  const [course, setCourse] = useState<string>('');
  const [hour, setHour] = useState<number>(0);

  const handleCreateProgram = async (formData: any) => {
    const newProgram: PostProgramRequest = {
      name: program,
      courses: [{ name: course, hour: hour, color: formData.get('color') }],
    };

    const success = await createProgram(newProgram);
    if (success) {
      setIsAdd(false);
      setChange(Math.random());
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
          <button type="submit">
            <Check size={15} />
          </button>
        </div>
      </form>
    </>
  );
}
