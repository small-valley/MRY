import { Ongoing } from '../../../shared/models/responses/getDashboardResponse';

const BASE_CLASS = 'home_dashboard_ongoing';

type Props = {
  ongoing: Ongoing[];
};

export default function OngoingList({ ongoing }: Props) {
  return (
    <div className={BASE_CLASS}>
      <h2>Ongoing</h2>
      <ul>
        {ongoing.map((ongoing, index) => (
          <li key={`${index}-${ongoing.cohortId}-${ongoing.cohortName}`} className={ongoing.period}>
            <h4>{ongoing.cohortName}</h4>
            <p>{ongoing.courseName}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
