import CurrentUser from '../CurrentUser/currentuser';
import NotificationHeader from '../notificationHeader/notificationHeader';
import './header.scss';

const BASE_CLASS = 'header';
export default function Header() {
  return (
    <div className={BASE_CLASS}>
      {/* <NotificationHeader /> */}
      <div></div>
      <CurrentUser />
    </div>
  );
}
