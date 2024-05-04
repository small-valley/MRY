const BASE_CLASS = 'home_dashboard_ongoing';

type ongoing = {
  cohortId: string;
  cohortName: string;
  courseName: string;
  period: string;
};
const tmp: ongoing[] = [
  {
    cohortId: 'aaa',
    cohortName: 'E1-0124',
    courseName: 'Analytics',
    period: 'Evening',
  },
  {
    cohortId: 'bbb',
    cohortName: 'E2-0124',
    courseName: 'Advanced Strategies',
    period: 'Evening',
  },
  {
    cohortId: 'ccc',
    cohortName: 'E2-0124',
    courseName: 'E-commerce',
    period: 'Afternoon',
  },
  { cohortId: 'ddd', cohortName: 'A1-0124', period: 'Morning', courseName: 'Program Project' },
  { cohortId: 'eee', cohortName: 'E3-0124', period: 'Afternoon', courseName: 'Analytics' },
  {
    cohortId: 'ccc',
    cohortName: 'E2-0124',
    courseName: 'E-commerce',
    period: 'Afternoon',
  },
  { cohortId: 'ddd', cohortName: 'A1-0124', period: 'Morning', courseName: 'Program Project' },
  { cohortId: 'eee', cohortName: 'E3-0124', period: 'Afternoon', courseName: 'Analytics' },
];
export default function OngoingList() {
  return (
    <div className={BASE_CLASS}>
      <h2>Ongoing</h2>
      <ul>
        {tmp.map((ongoing, index) => (
          <li key={`${index}-${ongoing.cohortId}-${ongoing.cohortName}`} className={ongoing.period}>
            <h4>{ongoing.cohortName}</h4>
            <p>{ongoing.courseName}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
