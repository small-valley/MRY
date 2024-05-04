import { Dispatch, SetStateAction } from 'react';
import { AvailableInstructors } from '../../../shared/models/responses/getAvailabilityResponse';
import './AvailableInstructor.scss';
import InstructorList from './instructorList';
import AvailableInstructorList from './AvailableInstructorList';

const BASE_CLASS = 'instructor';

type Props = {
  instructors: AvailableInstructors;
  instructorId: string;
  setInstructorId: Dispatch<SetStateAction<string>>;
};
export default function AvailableInstructor({ instructors, instructorId, setInstructorId }: Props) {
  return (
    <>
      <div className={BASE_CLASS}>
        <div className={`${BASE_CLASS}_wrap`}>
          <h5>Available </h5>
          <AvailableInstructorList
            instructors={instructors.availableInstructors}
            instructorId={instructorId}
            setInstructorId={setInstructorId}
          />
        </div>
        <div className={`${BASE_CLASS}_wrap`}>
          <h5>Preference</h5>
          <InstructorList instructors={instructors.availableInstructorsPreference} />
        </div>
        <div className={`${BASE_CLASS}_wrap`}>
          <h5>Unavailable </h5>
          <InstructorList instructors={instructors.unavailableInstructors} />
        </div>
      </div>
    </>
  );
}
