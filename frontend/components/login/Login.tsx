'use client';
import { Chrome, Github } from 'lucide-react';
import './login.scss';
import Image from 'next/image';
import { useState } from 'react';
const BASE_CLASS = 'login';

export default function Login() {
  const [isLogin, setIsLogin] = useState<Boolean>(true);

  return (
    <>
      <div className={`${BASE_CLASS} ${isLogin ? 'toggle' : ''} left`}>
        <form className="sign_form">
          <h1> Sign In</h1>
          <div className="sign_form_social">
            <button>
              <Chrome size={30} /> Google
            </button>
            <button>
              <Github size={30} /> Git Hub
            </button>
          </div>

          <label> or use your email password</label>
          <input name="id" type="email" placeholder="Email" required={true} />
          <input name="password" type="password" placeholder="Password" required={true} />
          <a>Forget your Password?</a>
          <button type="submit">SIGN IN</button>
        </form>
        <div className="toggleform toggle_right">
          <Image src="/imgs/logo_png.png" alt="mry" width={210} height={100}></Image>

          <h1> Welcome, Friend! </h1>
          <p> Register with your personal details to become a member</p>
          <p>Do you want to sign up?</p>
          <button
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
            onClick={() => {
              setIsLogin(true);
            }}
          >
            SIGN IN
          </button>
        </div>
        <form className="sign_form">
          <h1> Create Account</h1>
          <div className="sign_form_social">
            <button>
              <Chrome size={30} /> <div>Google</div>
            </button>
            <button>
              <Github size={30} /> <div>Git Hub</div>
            </button>
          </div>

          <label> or use your email password</label>
          <input name="name" type="text" placeholder="Name" required={true} />
          <input name="id" type="email" placeholder="Email" required={true} />
          <input name="password" type="password" placeholder="Password" required={true} />
          <a>Forget your Password?</a>
          <button type="submit">SIGN UP</button>
        </form>
      </div>
    </>
  );
}
