import { Schedule } from '../../../shared/models/responses/getCohortsResponse';

type Props = {
  schedules: Schedule[];
  name: string;
  room: string;
  period: string;
};

export default function CourseMonth({ schedules, name, room, period }: Props) {
  return (
    <>
      {schedules.length === 1 ? (
        <>
          {schedules[0].days[0] && schedules[0].days[0].includes('Monday') ? (
            <div className={`courseFull ${period}`}>
              {schedules[0].course.name} - {name} / {room}
            </div>
          ) : (
            <></>
          )}
        </>
      ) : (
        <div className="courseHalf">
          {schedules &&
            schedules.map((schedule, index) =>
              schedule.days[0] && schedule.days[0].includes('Monday') ? (
                <div key={`${name}-${index}`} className={`half ${period}`}>
                  {schedule.course.name} - {name} / {room}
                </div>
              ) : (
                <div key={`${name}-${index}`} className={`half ${period}`}>
                  {schedule.course.name} - {name} / {room}
                </div>
              )
            )}
        </div>
      )}
    </>
  );
}
