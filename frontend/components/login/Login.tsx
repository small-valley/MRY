'use client';
import { postApiData, setCookie } from '@/app/actions/common';
import { Chrome, Github } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FormEvent, useRef, useState } from 'react';
import { PostSigninRequest } from '../../../shared/models/requests/postSigninRequest';
import { PostSignupRequest } from '../../../shared/models/requests/postSignupRequest';
import { PostSigninResponse } from '../../../shared/models/responses/postSigninResponse';
import './login.scss';

const BASE_CLASS = 'login';

export default function Login() {
  const [isLogin, setIsLogin] = useState<Boolean>(true);
  const [message, setMessage] = useState<string>('');
  const router = useRouter();
  const emailSigninRef = useRef<HTMLInputElement>(null);
  const passwordSigninRef = useRef<HTMLInputElement>(null);
  const emailSignupRef = useRef<HTMLInputElement>(null);
  const passwordSignupRef = useRef<HTMLInputElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);

  const handleLocalSignin = async (e: FormEvent) => {
    e.preventDefault();
    const email = emailSigninRef.current?.value;
    const password = passwordSigninRef.current?.value;
    if (email && password) {
      const response = await postApiData<PostSigninRequest, PostSigninResponse>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL_D}/auth/signin`,
        { email, password }
      );
      if (response instanceof Error) {
        setMessage(response.message);
        setTimeout(() => {
          setMessage('');
        }, 5000);
      } else {
        setCookie(response.accessToken);
        router.push('/home');
      }
    }
  };

  const handleLocalSignup = async (e: FormEvent) => {
    e.preventDefault();
    const firstName = firstNameRef.current?.value;
    const lastName = lastNameRef.current?.value;
    const email = emailSignupRef.current?.value;
    const password = passwordSignupRef.current?.value;
    if (firstName && lastName && email && password) {
      const response = await postApiData<PostSignupRequest, PostSigninResponse>(
        `${process.env.NEXT_PUBLIC_API_BASE_URL_D}/auth/signup`,
        {
          firstName,
          lastName,
          email,
          password,
        }
      );
      if (response instanceof Error) {
        setMessage(response.message);
        setTimeout(() => {
          setMessage('');
        }, 5000);
      } else {
        setCookie(response.accessToken);
        router.push('/home');
      }
    }
  };

  const handleGoogleAuth = () => {
    window.open(`${process.env.NEXT_PUBLIC_API_BASE_URL_D}/auth/google`, '_self');
  };

  return (
    <>
      <div className={`${BASE_CLASS} ${isLogin ? 'toggle' : ''} left`}>
        <div className="sign_form">
          <h1> Sign In</h1>
          <div className="sign_form_social">
            <button className="login_btn_auth" onClick={handleGoogleAuth}>
              <Chrome size={30} /> Google
            </button>
            <button className="login_btn_auth">
              <Github size={30} /> Git Hub
            </button>
          </div>

          <label> or use your email password</label>
          <form className="sign_form_input" onSubmit={handleLocalSignin}>
            <input ref={emailSigninRef} name="id" type="email" placeholder="Email" required={true} />
            <input ref={passwordSigninRef} name="password" type="password" placeholder="Password" required={true} />

            <button className="login_btn_auth" type="submit">
              SIGN IN
            </button>
            <div className="message">{message}</div>
          </form>
        </div>

        <div className="toggleform toggle_right">
          <Image src="/imgs/logo_png.png" alt="mry" width={210} height={100}></Image>

          <h1> Welcome, Friend! </h1>
          <p> Register with your personal details to become a member</p>
          <p>Do you want to sign up?</p>
          <button
            className="login_btn_signup"
            type="button"
            onClick={() => {
              setIsLogin(false);
            }}
          >
            SIGN UP
          </button>
        </div>
      </div>

      <div className={`${BASE_CLASS} ${isLogin ? '' : 'toggle'} right`}>
        <div className="toggleform toggle_left">
          <Image src="/imgs/logo_png.png" alt="mry" width={210} height={100}></Image>

          <h1> Welcome, Friend! </h1>
          <p> Register with your personal details to become a member </p>
          <p> Do you have account?</p>
          <button
            type="button"
            className="login_btn_signup"
            onClick={() => {
              setIsLogin(true);
            }}
          >
            SIGN IN
          </button>
        </div>
        <form className="sign_form" onSubmit={handleLocalSignup}>
          <h1> Create Account</h1>
          <div className="sign_form_social">
            <button className="login_btn_auth" onClick={handleGoogleAuth}>
              <Chrome size={30} /> <div>Google</div>
            </button>
            <button className="login_btn_auth">
              <Github size={30} /> <div>Git Hub</div>
            </button>
          </div>

          <label> or use your email password</label>
          <input ref={firstNameRef} name="fname" type="text" placeholder="First Name" required={true} />
          <input ref={lastNameRef} name="lname" type="text" placeholder="Last Name" required={true} />
          <input ref={emailSignupRef} name="id" type="email" placeholder="Email" required={true} />
          <input ref={passwordSignupRef} name="password" type="password" placeholder="Password" required={true} />
          <button className="login_btn_auth" type="submit">
            SIGN UP
          </button>
          <div className="message">{message}</div>
        </form>
      </div>
    </>
  );
}
