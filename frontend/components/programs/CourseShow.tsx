import { Check, Trash2, X } from 'lucide-react';
import { Dispatch, SetStateAction, useState } from 'react';
//import shared model Fetch Type
import { PutCourseRequest } from '../../../shared/models/requests/putProgramRequest';
//function, type
import { deleteCourse, updateCourse } from '@/app/actions/programs';
import { Course, colors } from '@/type/programs';
type Props = {
  course: Course;
  setChange: Dispatch<SetStateAction<number>>;
  setMessage: Dispatch<SetStateAction<string>>;
};

const BASE_CLASS = 'program_content_wrap';
const BTN_BASE_CLASS = 'program_btn';
export default function CourseShow({ course, setChange, setMessage }: Props) {
  const [isClick, setClick] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [title, setTitle] = useState<string>(course.name);
  const [hour, setHour] = useState<number>(course.hour);

  const handleUpdateCourse = async (formData: any) => {
    const tmpCourse: PutCourseRequest = {
      id: course.id,
      name: formData.get('title'),
      hour: formData.get('hour'),
      color: formData.get('color'),
    };
    if (tmpCourse.name === course.name && tmpCourse.hour === course.hour && tmpCourse.color === course.color) {
      setClick(false);
    } else {
      try {
        const success = await updateCourse(tmpCourse);
        if (success) {
          setClick(false);
          setChange(Math.random());
        }
      } catch (error: any) {
        setClick(false);
        setChange(Math.random());
        setMessage('The Course can not update');
        setTimeout(() => {
          setMessage('');
        }, 4000);
      }
    }
  };

  const handleDeleteCourse = async () => {
    try {
      const success = await deleteCourse(course.id);
      if (success) {
        setClick(false);
        setIsDelete(false);
        setChange(Math.random());
      }
    } catch (error: any) {
      setClick(false);
      setIsDelete(false);
      setChange(Math.random());
      setMessage('The Coure can not delete');
      setTimeout(() => {
        setMessage('');
      }, 4000);
    }
  };
  return (
    <>
      <div className={`${BASE_CLASS}_course_row`} key={`${course.id}-${course.hour}-${course.name}`}>
        <li
          className={`${BASE_CLASS}_course_row_show ${isClick ? 'disable-click' : ''}`}
          onClick={() => setClick(true)}
        >
          <div className={course.color}>{course.name}</div>
          <div> {course.hour}h</div>
        </li>
        {isClick ? (
          <>
            {isDelete ? (
              <>
                <form className={`${BASE_CLASS}_course_row_del`} action={handleDeleteCourse}>
                  <h5> Confirm Delete {course.name} ?</h5>
                  <button className={`${BTN_BASE_CLASS}_del`} type="submit">
                    <Trash2 size={15} />
                  </button>
                  <button className={`${BTN_BASE_CLASS}_del`} type="button" onClick={() => setIsDelete(false)}>
                    <X size={15} />
                  </button>
                </form>
              </>
            ) : (
              <>
                <form className={`${BASE_CLASS}_course_row_edit`} action={handleUpdateCourse}>
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
                  <select name="color" defaultValue={colors[colors.findIndex((color) => color === course.color)]}>
                    {colors.map((color, index) => (
                      <option value={color} key={`${index}-${color}`}>
                        {color}
                      </option>
                    ))}
                  </select>
                  <button className={`${BTN_BASE_CLASS}_add`} type="submit">
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
    </>
  );
}
