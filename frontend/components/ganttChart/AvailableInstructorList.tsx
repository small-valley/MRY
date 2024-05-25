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
          <ul
            style={{
              display: 'flex',
              flexDirection: 'row',
            }}
          >
            {instructors
              .filter((user) => user.avatarUrl)
              .map(
                (user) =>
                  user.avatarUrl && (
                    <span
                      key={user.id}
                      id={user.id}
                      draggable={title === 'Available'}
                      onDragStart={() => {
                        setUser(user);
                        setFromList(true);
                      }}
                      onDrop={() => {
                        setFromList(false);
                      }}
                      style={{ cursor: title === 'Available' ? 'move' : 'not-allowed', position: 'relative' }}
                    >
                      {title !== 'Available' && (
                        <div
                          style={{
                            position: 'absolute',
                            bottom: 2.5,
                            left: 0,
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: 'rgba(0, 0, 0, 0.5)',
                            zIndex: 10,
                          }}
                        ></div>
                      )}
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
        background: 'white',
        padding: '20px',
        borderRadius: '5px',
        display: 'flex',
        width: '100%',
      }}
    >
      <InstructorList title="Available" instructors={availableInstructors} />
      <InstructorList title="Preference" instructors={availableInstructorsPreference} />
      <InstructorList title="Unavailable" instructors={unavailableInstructors} />
    </div>
  );
};

export default AvailableInstructorList;
