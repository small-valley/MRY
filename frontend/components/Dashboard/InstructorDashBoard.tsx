import InstructorVacation from '../Instructors/InstructorVacation';
import InstructorCohortsList from './InstructorCohortsList';

const BASE_CLASS = 'home_instructorDashboard';
export default function InstructorDashBoard() {
  return (
    <div className={BASE_CLASS}>
      <InstructorCohortsList />
    </div>
  );
}
