import React, { useState } from 'react';
import Image from 'next/image';
import { Instructor, Schedule } from '../../../shared/models/responses/getCohortsResponse';
import { GetCohortsResponse } from '../../../shared/models/responses/getCohortsResponse';
import './GanttChart.scss';

interface InstructorAvatarProps {
  schedule: Schedule;
  // cohorts: GetCohortsResponse[];
  open: { [key: string]: boolean };
  setOpen: (open: { [key: string]: boolean }) => void;
  user: Instructor | undefined;
  setUser: (user: Instructor) => void;
  // setCohorts: (cohorts: GetCohortsResponse[]) => void;
  getCohorts: () => void;
  courseInfoModalOpen: { [key: string]: boolean };
  fromList: boolean;
}

const InstructorAvatar = ({
  schedule,
  // cohorts,
  open,
  setOpen,
  user,
  setUser,
  // setCohorts,
  getCohorts,
  courseInfoModalOpen,
  fromList,
}: InstructorAvatarProps) => {
  const [dropDisabled, setDropDisabled] = useState(false);

  const handleDragStart = () => {
    setUser(schedule.instructor);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const sameUser = user?.id === e.currentTarget.id;
    const targetIsNotBlank = e.currentTarget.id !== '';
    if (fromList && courseInfoModalOpen[schedule.id]) return;
    if (sameUser || targetIsNotBlank) {
      setDropDisabled(true);
      e.dataTransfer.dropEffect = 'none';
    } else {
      setDropDisabled(false);
    }
  };

  const handleDragLeave = () => {
    setDropDisabled(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (dropDisabled || !courseInfoModalOpen[schedule.id]) {
      setDropDisabled(false);
      return;
    }
    const droppedUserId = e.currentTarget.id;
    if (user?.id === droppedUserId) {
      return;
    }
    // const newCohorts = cohorts.map((cohort: GetCohortsResponse) => {
    //   cohort.schedules = cohort.schedules.map((schedule_: Schedule) => {
    //     if (user && schedule_.id === schedule.id) {
    //       return {
    //         ...schedule_,
    //         instructor: {
    //           id: user.id,
    //           name: user.name,
    //           avatarUrl: user.avatarUrl,
    //         },
    //       };
    //     } else {
    //       return schedule_;
    //     }
    //   });
    //   return cohort;
    // });
    // setCohorts(newCohorts);
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        scheduleId: schedule.id,
        instructorId: user?.id,
      }),
    };
    await fetch(`${baseUrl}/schedules/instructor/room`, options).then(() => {
      getCohorts();
    });
  };

  const handleDragEnd = () => {
    setDropDisabled(false);
  };

  const avatarSize = schedule.days?.length === 0 || schedule.days?.includes('Monday - Friday') ? 40 : 20;
  return (
    <div
      style={{
        borderRadius: '50%',
        padding: 0,
        cursor: 'move',
        backgroundColor: 'none',
        border: courseInfoModalOpen[schedule.id] ? '4px solid #416c64' : 'none',
        width: courseInfoModalOpen[schedule.id] ? avatarSize * 1.15 : avatarSize,
        height: courseInfoModalOpen[schedule.id] ? avatarSize * 1.15 : avatarSize,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: dropDisabled ? 0.5 : 1,
      }}
      id={schedule.instructor?.id || ''}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onDragEnd={handleDragEnd}
      onClick={() => {
        setOpen({
          ...open,
          [schedule.instructor?.id]: !open[schedule.instructor?.id],
        });
      }}
    >
      <Image
        src={schedule?.instructor?.avatarUrl ? schedule?.instructor?.avatarUrl : '/imgs/no-image-user.png'}
        alt={`${schedule?.instructor?.name} Image`}
        width={avatarSize}
        height={avatarSize}
        style={{
          borderRadius: '50%',
        }}
      />
    </div>
  );
};

export default InstructorAvatar;
