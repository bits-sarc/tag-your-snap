import { Link } from 'react-router-dom';
import FancyButton from './FancyButton';
import sarcLogo from '/sarc.svg';

export default function NavBar() {
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
          <div className="lg:basis-1/8">
            <FancyButton text="Login" />
          </div>
          <div className="lg:basis-1/8 basis-0"></div>
        </div>
      </div>
    </nav>
  )
}