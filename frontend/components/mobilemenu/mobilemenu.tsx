'use client';
import { Bell, GraduationCap, Home, NotebookText, UsersRound } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './mobilemenu.scss';

const BASE_CLASS = 'mobile_menu';

export default function MobileMenu() {
  const currentRouter = usePathname();
  const NAV_ITEMS = [
    { name: 'Home', path: '/', icon: <Home size={25} /> },
    { name: 'Program', path: '/programs', icon: <GraduationCap size={25} /> },
    { name: 'Cohorts', path: '/cohorts', icon: <NotebookText size={25} /> },
    {
      name: 'Instructors',
      path: '/instructors',
      icon: <UsersRound size={25} />,
    },
  ];

  return (
    <>
      <div className={BASE_CLASS}>
        <ul className={`${BASE_CLASS}_links`}>
          {NAV_ITEMS.map(({ name, path, icon }, index) => (
            <li key={`${name}-${index}`} className={`${currentRouter === path ? 'current' : ''}`}>
              <Link href={path}>{icon}</Link>
            </li>
          ))}
          <li>
            <Bell size={25} />
          </li>
          <li>
            <Image src="/imgs/user-round.png" alt="avatar" width={30} height={30} />
          </li>
        </ul>
      </div>
    </>
  );
}
