'use client';
import { useCurrentUserContext } from '@/app/contexts/CurrentUserContext';
import { Bell, GraduationCap, Home, NotebookText, UsersRound } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import './mobilemenu.scss';

const BASE_CLASS = 'mobile_menu';

export default function MobileMenu() {
  const [isManager, setIsManager] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const currentRouter = usePathname();
  const { currentUser } = useCurrentUserContext();

  useEffect(() => {
    if (currentUser) {
      setIsManager(currentUser?.role === 'manager');
      setIsLoading(false);
    }
  });
  const NAV_ITEMS = [
    { name: 'Home', path: '/', icon: <Home size={25} /> },
    { name: 'Program', path: '/programs', icon: <GraduationCap size={25} /> },
    { name: 'Cohorts', path: '/cohorts', icon: <NotebookText size={25} /> },
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
      {!isLoading && (
        <div className={BASE_CLASS}>
          <ul className={`${BASE_CLASS}_links`}>
            {isManager &&
              NAV_ITEMS.map(({ name, path, icon }, index) => (
                <li key={`${name}-${index}`} className={`${currentRouter === path + '/' ? 'current' : ''}`}>
                  <Link href={path}>{icon}</Link>
                </li>
              ))}
            {!isManager &&
              NAV_INSTRUCTOR_ITEMS.map(({ name, path, icon }, index) => (
                <li key={`${name}-${index}`} className={`${currentRouter === path + '/' ? 'current' : ''}`}>
                  <Link href={path}>{icon}</Link>
                </li>
              ))}
            <li>
              <Image
                src={currentUser?.avatarUrl ? currentUser.avatarUrl : '/imgs/sample.jpeg'}
                alt="avatar"
                width={30}
                height={30}
              />
            </li>
          </ul>
        </div>
      )}
    </>
  );
}
