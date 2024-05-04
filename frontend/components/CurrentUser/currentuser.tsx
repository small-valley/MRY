'use client';
import { ChevronDown, LogOut, Send, Shuffle, UserRound } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import './currentuser.scss';

const BASE_CLASS = 'currentuser';
export default function CurrentUser() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMessage, setIsMessage] = useState(false);
  const [message, setMessage] = useState('');

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleMessagePopup = () => {
    setIsOpen(!isOpen);
    setIsMessage(true);
  };

  const onSubmit = async () => {
    const body = JSON.stringify({
      title: 'Message',
      description: message,
      type: 'message',
      senderId: '2f8bfba0-52bf-4192-915e-a504598476f9', // FIXME: Set senderId
      receiverId: '98b499cb-47d7-4596-8cc4-788ff37b8f67', // Rodrigo's ID
    });
    try {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body,
      };
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/notifications`, options);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsMessage(false);
    }
  };

  return (
    <>
      <div className={`${BASE_CLASS} ${isOpen ? 'open' : ''}`}>
        <button onClick={toggleDropdown}>
          <Image src="/imgs/user-round.png" alt="avatar" width={35} height={35} />
          Yumi Lim
          <ChevronDown size={25} />
        </button>
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
            <a href="#">
              <li onClick={toggleDropdown}>
                {' '}
                <Shuffle size={20} />
                Instructor Board
              </li>
            </a>
            <a href="/">
              <li onClick={toggleDropdown}>
                <LogOut size={20} />
                Logout
              </li>
            </a>
          </ul>
        )}
      </div>
      <div className={`message_wrap ${isMessage ? 'messageOpen' : ''}`}>
        <div className="message_popup">
          <form>
            <h3>Message to Manager Name </h3>
            <input
              type="text"
              required
              value={message}
              onChange={(e) => {
                e.preventDefault();
                setMessage(e.target.value);
              }}
            />
            <button type="submit" onClick={onSubmit}>
              Send
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
