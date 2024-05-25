import { GetDashboardResponse } from '../../../shared/models/responses/getDashboardResponse';
import InstructorCohortsList from './InstructorCohortsList';

const BASE_CLASS = 'home_instructorDashboard';
export default function InstructorDashBoard({
  dashboard,
  setChange,
}: {
  dashboard: GetDashboardResponse;
  setChange: (random: number) => void;
}) {
  return (
    <div className={BASE_CLASS}>
      <InstructorCohortsList ongoing={dashboard.ongoing} upcoming={dashboard.upcoming} setChange={setChange} />
    </div>
  );
}
