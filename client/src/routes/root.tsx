import { Outlet } from 'react-router-dom';
import NavBar from '../components/NavBar';

export default function Root() {
  return (
    <div className='bg-black text-white relative'>
      <NavBar />
      <div className="pt-48 min-h-screen">
        <Outlet />
      </div>
    </div>
  );
}