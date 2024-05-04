import React from 'react';
import Image from 'next/image';
import { Instructor } from '../../../shared/models/responses/getCohortsResponse';

interface AvailableInstructorListProps {
  availableInstructors: Instructor[];
  availableInstructorsPreference: Instructor[];
  unavailableInstructors: Instructor[];
  setUser: (user: Instructor) => void;
  setFromList: (fromList: boolean) => void;
}

interface InstructorListProps {
  title: string;
  instructors: Instructor[];
}

const AvailableInstructorList = ({
  availableInstructors,
  availableInstructorsPreference,
  unavailableInstructors,
  setUser,
  setFromList,
}: AvailableInstructorListProps) => {
  const InstructorList = ({ title, instructors }: InstructorListProps) => {
    return (
      instructors &&
      instructors.length > 0 && (
        <div
          style={{
            marginRight: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <h5
            style={{
              color: 'var(--color-text)',
              fontSize: '1rem',
              marginBottom: '10px',
            }}
          >
            {title}
          </h5>
          <ul>
            {instructors
              .filter((user) => user.avatarUrl)
              .map(
                (user) =>
                  user.avatarUrl && (
                    <span
                      key={user.id}
                      id={user.id}
                      draggable="true"
                      onDragStart={() => {
                        setUser(user);
                        setFromList(true);
                      }}
                      onDrop={() => {
                        setFromList(false);
                      }}
                      style={{ cursor: 'move' }}
                    >
                      <Image src={user.avatarUrl} alt="avatar" width={40} height={40} style={{ borderRadius: '50%' }} />
                    </span>
                  )
              )}
          </ul>
        </div>
      )
    );
  };

  return (
    <div
      style={{
        position: 'absolute',
        zIndex: 100,
        top: 580,
        left: 308,
        background: 'white',
        padding: '20px',
        outline: '2px solid var(--color-outline)',
        boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)',
        borderRadius: '5px',
        display: 'flex',
      }}
    >
      <InstructorList title="Available" instructors={availableInstructors} />
      <InstructorList title="Preference" instructors={availableInstructorsPreference} />
      <InstructorList title="Unavailable" instructors={unavailableInstructors} />
    </div>
  );
};

export default AvailableInstructorList;
