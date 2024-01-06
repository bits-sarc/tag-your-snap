import { Outlet } from 'react-router-dom';
import NavBar from '../components/NavBar';

export default function Root() {
  return (
    <div className='bg-black text-white'>
      <NavBar />
      <Outlet />
    </div>
  );
}