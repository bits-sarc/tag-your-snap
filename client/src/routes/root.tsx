import { Outlet } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { Toaster } from 'react-hot-toast';

export default function Root() {
  const mobile = () => {
    var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    windowWidth = w.innerWidth || e.clientWidth || g.clientWidth; //window width

    return windowWidth < 798;
  }

  return (
    <div>
      {mobile() ? (
        <div className="bg-black text-white min-h-screen text-center">
          Please open the website on your nearest desktop or laptop. <br />
          Regards, SARC
        </div>
      ) : (
        <div className='bg-black text-white relative'>
          <NavBar />
          <div className="min-h-screen">
            <Outlet />
          </div>
          <Toaster position="bottom-center" gutter={8} toastOptions={{ style: { background: "#363636", color: "#fff" } }} />
        </div>
      ) }
    </div>
  )
}