import OngoingList from './OngoingList';
import UpcomingList from './UpcomingList';
import SchoolBreak from '../SchoolBreak/SchoolBreak';
import { GetDashboardResponse } from '../../../shared/models/responses/getDashboardResponse';

const BASE_CLASS = 'home_dashboard';

type Props = {
  managerDashboard: GetDashboardResponse;
};

export default function Dashboard({ managerDashboard }: Props) {
  return (
    <div className={BASE_CLASS}>
      <div className={`${BASE_CLASS}_top`}>
        <OngoingList ongoing={managerDashboard.ongoing} />
        <SchoolBreak />
      </div>
      <UpcomingList upcoming={managerDashboard.upcoming} />
    </div>
  );
}
