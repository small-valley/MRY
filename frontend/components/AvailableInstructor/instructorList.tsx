import Image from 'next/image';
import { Instructor } from '../../../shared/models/responses/getAvailabilityResponse';

type Props = {
  instructors: Instructor[];
};
const BASE_CLASS = 'instructor_list';
export default function InstructorList({ instructors }: Props) {
  return (
    <>
      {instructors.length === 0 && <div> No Instructor</div>}
      <ul className={`${BASE_CLASS}`}>
        {instructors.map((instructor, index) => (
          <li className={`${BASE_CLASS}_avatar`} key={`${instructor.id}-${index}-${instructor.firstName}`}>
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
