import { Outlet } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { Toaster } from 'react-hot-toast';

export default function Root() {
  return (
    <div className='bg-black text-white relative'>
      <NavBar />
      <div className="min-h-screen">
        <Outlet />
      </div>
      <Toaster position="bottom-center" gutter={8} toastOptions={{ style: { background: "#363636", color: "#fff" } }} />
    </div>
  );
}