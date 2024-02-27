import { Link } from 'react-router-dom';
import { jwtDecode, JwtPayload } from "jwt-decode";
import Cookies from 'js-cookie';

export default function FancyButton({ text, login, auth }: { text: string, login: Function, auth?: boolean }) {

  if (auth) {
    const decoded = jwtDecode(Cookies.get('jwt') as string) as JwtPayload & { branch: string };
    if (decoded.branch !== undefined) return (
      <Link to={`tag/${decoded.branch}`} className="transition-transform duration-75 btn px-16 py-2 text-4xl rounded-full border-2 font-gilmer-bold" style={{ borderColor: '#DAC86D' }}>Tag</Link>
    );

    return (
      <Link to="tag" className="transition-transform duration-75 btn px-16 py-2 text-4xl rounded-full border-2 font-gilmer-bold" style={{ borderColor: '#DAC86D' }}>Tag</Link>
    )
  }

  return (
    <button onClick={() => login()} className="transition-transform duration-75 btn px-16 py-2 text-4xl rounded-full border-2 font-gilmer-bold" style={{ borderColor: '#DAC86D' }}>{text}</button>
  )
}