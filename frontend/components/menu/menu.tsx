'use client';
import { useCurrentUserContext } from '@/app/contexts/CurrentUserContext';
import { Bell, CalendarCheck, GraduationCap, Home, NotebookText, UsersRound } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import './menu.scss';

const BASE_CLASS = 'menu';

export default function Menu() {
  const [isManager, setIsManager] = useState<boolean>(true);
  const currentRouter = usePathname();
  const { currentUser } = useCurrentUserContext();

  useEffect(() => {
    if (currentUser) {
      setIsManager(currentUser?.role === 'manager');
    }
  }, [currentUser]);

  const NAV_ITEMS = [
    { name: 'Home', path: '/home', icon: <Home size={25} /> },
    { name: 'Program', path: '/programs', icon: <GraduationCap size={25} /> },
    { name: 'Cohorts', path: '/cohorts', icon: <NotebookText size={25} /> },
    {
      name: 'Schedules',
      path: '/schedules',
      icon: <CalendarCheck size={25} />,
    },
    {
      name: 'Instructors',
      path: '/instructors',
      icon: <UsersRound size={25} />,
    },
    {
      name: 'Notification',
      path: '/notification',
      icon: <Bell size={25} />,
    },
  ];

  const NAV_INSTRUCTOR_ITEMS = [
    { name: 'Home', path: '/home', icon: <Home size={25} /> },
    {
      name: 'Notification',
      path: '/notification',
      icon: <Bell size={25} />,
    },
  ];

  return (
    <>
      {currentUser && (
        <div className={BASE_CLASS}>
          <a href="/home">
            <Image className="logo" src="/imgs/logo_png.png" alt="logo" width={180} height={100} />
          </a>
          <ul className={`${BASE_CLASS}_links`}>
            {isManager &&
              NAV_ITEMS.map(({ name, path, icon }, index) => (
                <li key={`${name}-${index}`} className={`${currentRouter === path ? 'current' : ''}`}>
                  <Link href={path}>
                    {icon}
                    <div className="title">{name}</div>
                  </Link>
                </li>
              ))}
            {!isManager &&
              NAV_INSTRUCTOR_ITEMS.map(({ name, path, icon }, index) => (
                <li key={`${name}-${index}`} className={`${currentRouter === path ? 'current' : ''}`}>
                  <Link href={path}>
                    {icon}
                    <div className="title">{name}</div>
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      )}
    </>
  );
}
