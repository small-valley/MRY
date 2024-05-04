const BASE_CLASS = 'home_todaybar';
type today = {
  cohortId: string;
  cohortName: string;
  courseName: string;
  period: string;
  room: string;
  instructor: string;
};
const tmp: today[] = [
  {
    cohortId: 'bbb',
    cohortName: 'E2-0124',
    courseName: 'Advanced Strategies',
    room: 'Facebook',
    instructor: 'Mriam',
    period: 'Evening',
  },
  {
    cohortId: 'ccc',
    cohortName: 'E2-0124',
    courseName: 'E-commerce',
    room: 'Facebook',
    instructor: 'Mriam',
    period: 'Afternoon',
  },
];

export default function InstructorTodayBar() {
  return (
    <div className={BASE_CLASS}>
      <h1> Today</h1>
      {tmp.map((today, index) => (
        <li key={`${index}-${today.cohortId}-${today.cohortName}`}>
          <div>
            <h3>{today.courseName}</h3>
            <p className={today.period}>{today.period}</p>
          </div>
          <label>{today.instructor}</label>
          <div>
            {today.cohortName} / {today.room}
          </div>
        </li>
      ))}
    </div>
  );
}
