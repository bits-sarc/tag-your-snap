import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

export default function Tag(){
  const [auth, setAuth] = useState<boolean>(false);
  const navigate = useNavigate();

  if (Cookies.get('jwt') !== undefined && !auth) {
    setAuth(true);
  }

  useEffect(() => {
    if (!auth) {
      navigate("/");
    }
  })
  
  return (
    <div>Test</div>
  )
}