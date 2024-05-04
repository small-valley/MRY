import Image from 'next/image';
import { Instructor } from '../../../shared/models/responses/getAvailabilityResponse';
import { Dispatch, SetStateAction } from 'react';

type Props = {
  instructors: Instructor[];
  instructorId: string;
  setInstructorId: Dispatch<SetStateAction<string>>;
};
const BASE_CLASS = 'instructor_list';
export default function AvailableInstructorList({ instructors, instructorId, setInstructorId }: Props) {
  return (
    <>
      {instructors.length === 0 && <div> No Instructor</div>}
      <ul className={`${BASE_CLASS}`}>
        {instructors.map((instructor, index) => (
          <li
            className={`${BASE_CLASS}_avatar ${instructorId === instructor.id ? 'selected' : ''}`}
            key={`${instructor.id}-${index}-${instructor.firstName}`}
            onClick={() => {
              setInstructorId(instructor.id);
            }}
          >
            {instructor.avatarUrl == '' ? (
              <Image src="/imgs/user-round.png" alt="avatar" width={35} height={35} />
            ) : (
              <Image src={instructor.avatarUrl} alt="avatar" width={35} height={35} />
            )}
            <div>{instructor.firstName}</div>
          </li>
        ))}
      </ul>
    </>
  );
}
