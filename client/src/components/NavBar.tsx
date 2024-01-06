import { Link } from 'react-router-dom';
import FancyButton from './FancyButton';
import sarcLogo from '/sarc.svg';
import { useGoogleLogin } from '@react-oauth/google';
import Cookies from 'js-cookie';
import { useState } from 'react';

export default function NavBar() {
  const [auth, setAuth] = useState<boolean>(false);

  if (Cookies.get('jwt') !== undefined && !auth) {
    setAuth(true);
  }

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const url = "http://localhost:1337/users/google/";
      const data = {
        token: tokenResponse.access_token,
      }

      const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
      });

      const json = await response.json()

      if (json.error) {
        alert(json.message)
        return
      }

      setAuth(true);
      Cookies.set('jwt', json.data.access_token, { expires: 1 });
    },
  });

  return (
    <nav className="px-4 md:px-8 xl:px-48">
      <div className="px-2">
        <div className="relative flex h-32 items-center justify-between">
          <div className="lg:basis-1/8 basis-0"></div>
          <div className="flex flex-row lg:basis-2/8">
            <img src={sarcLogo} alt="SARC Logo" width={59} height={65} />
            <span className="hidden md:inline px-2 text-5xl font-arial font-bold my-auto pl-6">SARC</span>
          </div>
          <div className="flex justify-around lg:basis-7/12 px-16 text-xl font-gilmer-bold">
            <div>
              <Link to="/">Home</Link>
            </div>
            <div>
              <a href="#about">About</a>
            </div>
            <div>
              <Link to="/">Contact</Link>
            </div>
            <div>
              <Link to="/">Developers</Link>
            </div>
          </div>
          <div className="lg:basis-1/8 custom-follow-mouse">
            <FancyButton text="Login" auth={auth} login={login} />
          </div>
          <div className="lg:basis-1/8 basis-0"></div>
        </div>
      </div>
    </nav>
  )
}