import { Link, useNavigate } from 'react-router-dom';
import FancyButton from './FancyButton';
import { useGoogleLogin } from '@react-oauth/google';
import { jwtDecode, JwtPayload } from "jwt-decode";
import Cookies from 'js-cookie';
import { useState } from 'react';

export default function NavBar() {
  const [auth, setAuth] = useState<boolean>(false);
  const [navMenu, setNavMenu] = useState<boolean>(false);
  const navigate = useNavigate();

  if (Cookies.get('jwt') !== undefined && !auth) {
    setAuth(true);
  }

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const url = "https://snaps-api.bits-sarc.in/users/google/";
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

      const json: { error: boolean, message: string, data?: any } = await response.json()

      if (json.error) {
        alert(json.message)
        return
      }

      setAuth(true);
      Cookies.set('jwt', json.data.access_token, { expires: 1 });

      const decoded = jwtDecode(Cookies.get('jwt') as string) as JwtPayload & { branch: string };
      if (decoded.branch !== undefined)
        navigate(`/tag/${decoded.branch}`)
      else
        navigate('/tag');
    },
  });

  return (
    <nav className="px-4 md:px-8 xl:px-48 w-screen fixed top-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7539390756302521) 50%, rgba(0,0,0,0.5270483193277311) 81%, rgba(0,0,0,0) 100%)", zIndex: 10000 }}>
      <div className={(navMenu ? "bg-gradient-to-b from-black to-neutral-900 " : "") + "px-2 lg:from-transparent lg:to-transparent lg:bg-transparent rounded-3xl mt-4 pb-8"}>
        <div className="relative flex h-32 items-center justify-between">
          <div className="lg:basis-1/8 basis-0"></div>
          <div className="flex flex-row flex-start lg:basis-2/8">
            <span className="pt-2 inline px-2 text-5xl font-arial font-bold my-auto pl-6">SARC</span>
          </div>
          <div className="justify-around lg:basis-7/12 px-16 text-xl font-gilmer-bold hidden lg:flex">
            <div>
              <Link to="/">Home</Link>
            </div>
            <div>
              <a href="#about">About</a>
            </div>
            <div>
              <Link to="#contact">Contact</Link>
            </div>
            <div>
              <Link to="#faq">FAQ</Link>
            </div>
            <div>
              <Link to="/">Developers</Link>
            </div>
          </div>
          <div className="hidden lg:inline lg:basis-1/8 custom-follow-mouse">
            <FancyButton text="Login" auth={auth} login={login} />
          </div>
          <div className="w-full lg:hidden flex justify-end pr-2" onClick={() => setNavMenu(!navMenu)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
            </svg>
          </div>
          <div className="lg:basis-1/8 basis-0"></div>
        </div>
        {navMenu && (
          <div className="flex flex-col font-gilmer-bold gap-5 text-center text-3xl lg:hidden">
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
          <div className="mt-4">
            <FancyButton text="Login" auth={auth} login={login} />
          </div>
        </div>
        )}
      </div>
    </nav>
  )
}