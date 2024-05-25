'use client';

import { updateIntructorRoom } from '@/app/actions/cohorts';
import useAvailability from '@/app/hooks/cohorts/useAvailability';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { PutScheduleInstructorOrRoomRequest } from '../../../shared/models/requests/putScheduleRequest';
import { Course } from '../../../shared/models/responses/getCohortResponse';
import AvailableInstructor from '../AvailableInstructor/AvailableInstructor';
import AvailableRoom from '../availabeRoom/AvailableRoom';
import Todo from '../todo/Todo';
const BASE_CLASS = 'cohort_table_content';
const BTN_BASE_CLASS = 'cohort_btn';

type Props = {
  course: Course;
  setChange: Dispatch<SetStateAction<number>>;
};
export default function CohortRowAssign({ course, setChange }: Props) {
  const { availability, fetchAvailability } = useAvailability(course.scheduleId);
  const [instructorId, setInstructorId] = useState<string>(course.instructorId);
  const [roomId, setRoomId] = useState<string>(course.roomId);
  const [assign, setAssign] = useState<number>(0);

  useEffect(() => {
    fetchAvailability();
  }, [assign]);

  const handleUpdateRoomAndInstructor = async () => {
    if (instructorId != course.instructorId || roomId != course.roomId) {
      const updateSchedule: PutScheduleInstructorOrRoomRequest = {
        scheduleId: course.scheduleId,
        instructorId: instructorId,
        roomId: roomId,
      };
      console.log(updateSchedule);
      try {
        const success = await updateIntructorRoom(updateSchedule);
        if (success) {
          setChange(Math.random());
          setAssign(Math.random());
        }
      } catch (error: any) {
        console.log(error);
      }
    }
  };

  return (
    <div className={`${BASE_CLASS}_detailcourse`}>
      <div className={`${BASE_CLASS}_detailcourse_room`}>
        <h4>Rooms</h4>
        {availability && <AvailableRoom rooms={availability.availableRooms} roomId={roomId} setRoomId={setRoomId} />}
      </div>
      <div className={`${BASE_CLASS}_detailcourse_firstrow`}>
        <div className={`${BASE_CLASS}_detailcourse_instructor`}>
          <h4>Instructors</h4>
          {availability && (
            <AvailableInstructor
              instructors={availability.availableInstructors}
              instructorId={instructorId}
              setInstructorId={setInstructorId}
            />
          )}
        </div>
        <div className={`${BASE_CLASS}_detailcourse_todo`}>
          <h4>{course.name} Task</h4>
          {availability && <Todo todos={availability.todos} scheduleId={course.scheduleId} setChange={setAssign} />}
        </div>
        <div className={`${BASE_CLASS}_detailcourse_save`}>
          <button className={`${BTN_BASE_CLASS}_save`} type="button" onClick={handleUpdateRoomAndInstructor}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
