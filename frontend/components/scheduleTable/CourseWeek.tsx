import { Schedule } from '../../../shared/models/responses/getCohortsResponse';

type Props = {
  schedules: Schedule[];
  name: string;
  room: string;
};

export default function CourseWeek({ schedules, name, room }: Props) {
  return (
    <>
      {schedules.length === 5 ? (
        <>
          {schedules[0].days[0]?.includes('Monday') ? (
            <div className={`courseFull ${schedules[0].course.color}`}>
              {schedules[0].course.name} - {name} / {room}
            </div>
          ) : (
            <></>
          )}
        </>
      ) : (
        <div className="courseHalf">
          {schedules.map((schedule, index) =>
            schedule.days[0]?.includes('Monday') ? (
              <div key={index} className={`half ${schedule.course.color}`}>
                {schedule.course.name} - {name} / {room}
              </div>
            ) : (
              <div key={index} className={`half ${schedule.course.color}`}>
                {schedule.course.name} - {name} / {room}
              </div>
            )
          )}
        </div>
      )}
    </>
  );
}
