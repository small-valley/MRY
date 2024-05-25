'use client';
import { deleteCookie, getAccessToken, postApiData } from '@/app/actions/common';
import { useCurrentUserContext } from '@/app/contexts/CurrentUserContext';
import { ChevronDown, LogOut, Send, Shuffle, UserRound } from 'lucide-react';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import './currentuser.scss';
import useManagerId from '@/app/hooks/instructors/useManagerId';

const BASE_CLASS = 'currentuser';
const BTN_BASE_CLASS = 'currentuser_btn';
export default function CurrentUser() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMessage, setIsMessage] = useState(false);
  const [message, setMessage] = useState('');
  const { receiverId } = useManagerId();
  const { currentUser } = useCurrentUserContext();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleMessagePopup = () => {
    setIsOpen(!isOpen);
    setIsMessage(true);
  };

  const onSubmit = async () => {
    try {
      if (receiverId && currentUser?.userId) {
        const body = JSON.stringify({
          title: 'Message',
          description: message,
          type: 'message',
          senderId: currentUser?.userId,
          receiverId: receiverId,
        });
        const options = {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
            'Content-Type': 'application/json',
          },
          body: body,
        };
        await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL_B}/notifications`, options);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsMessage(false);
      setMessage('');
    }
  };

  const logout = async () => {
    await postApiData<null, null>(`${process.env.NEXT_PUBLIC_API_BASE_URL_D}/auth/logout`, null);
    deleteCookie();
  };

  const memoizedCurrentUser = useMemo(
    () => (
      <>
        <Image
          src={currentUser?.avatarUrl ? currentUser.avatarUrl : '/imgs/sample.jpeg'}
          alt="avatar"
          width={35}
          height={35}
        />
        {currentUser?.firstName} {currentUser?.lastName}
        <ChevronDown size={25} />
      </>
    ),
    [currentUser]
  );

  return (
    <>
      <div className={`${BASE_CLASS} ${isOpen ? 'open' : ''}`}>
        {currentUser && (
          <button className={`${BTN_BASE_CLASS}_user`} onClick={toggleDropdown}>
            {memoizedCurrentUser}
          </button>
        )}
        {isOpen && (
          <ul className={`${BASE_CLASS}_content`}>
            <a href="/profile">
              <li onClick={toggleDropdown}>
                <UserRound size={20} />
                Profile Setting
              </li>
            </a>
            <a>
              <li onClick={handleMessagePopup}>
                <Send size={20} />
                Message to Manager
              </li>
            </a>
            <a href="/">
              <li onClick={logout}>
                <LogOut size={20} />
                Logout
              </li>
            </a>
          </ul>
        )}
      </div>
      <div className={`message_wrap ${isMessage ? 'messageOpen' : ''}`}>
        <div className="message_popup">
          <button className="message_close_button" onClick={() => setIsMessage(false)}>
            X
          </button>
          <form>
            <h3>Message to Manager </h3>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={8} />
            <button
              type="submit"
              className="message_popup_btn"
              onClick={(e) => {
                e.preventDefault();
                onSubmit();
              }}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
