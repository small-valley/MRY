'use client';

import { Bell, ChevronDown } from 'lucide-react';
import './notificationHeader.scss';
import { useState } from 'react';

const BASE_CLASS = 'notificationHeader';

const sample_noti = [{ title: 'confirm change course' }, { title: 'vacation check' }];
export default function NotificationHeader() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <div className={`${BASE_CLASS} ${isOpen ? 'open' : ''}`}>
        <button onClick={toggleDropdown}>
          <Bell size={25} />
          Notifications [{sample_noti.length}]
          <ChevronDown size={25} />
        </button>
        {isOpen && (
          <ul className={`${BASE_CLASS}_content`}>
            {sample_noti.map(({ title }, index) => (
              <a href="#">
                <li key={index} onClick={toggleDropdown}>
                  {title}
                </li>
              </a>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
