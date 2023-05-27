import './App.css';
import jwt_decode from 'jwt-decode';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useGoogleLogin } from '@react-oauth/google';
import Hero from './Hero';
import Contact from './Contact';
import Nav from './Nav';
// import { FcGoogle } from 'react-icons/fc';

function App(){

  const [user, setUser] = useState({});

  function handleCallbackResponse(response) {
    console.log("Encoded JWT ID token:" + response.credential);
    var userObject = jwt_decode(response.credential);
    console.log(userObject);
    setUser(userObject);
    document.getElementById("signInDiv").hidden = true;
    
    // sends tokn to the api
    sendTokenToBackend(response.credential);
  }

  // function handleSignOut(event) {
  //   setUser({});
  //   document.getElementById("signInDiv").hidden = false;
  // }

  const sendTokenToBackend = (token) => {
    const headers = {
      'Authorization': `Bearer ${token}`
    };

    axios.get('the baceknd api url', { headers })
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  };


  const responseGoogle = (response) => {
    // code scope authuser hd prompt
    // pass the above parameters to the backend api url 
    // /auth/google/callback
    // this will return the jwt token
    // decode the token as needed
    // for any subsequent requests the token should be present in the authorization 
    // header for the user to be logged in

    handleCallbackResponse(response);
  }
  
  const login = useGoogleLogin({
    onSuccess: responseGoogle,
    flow: 'auth-code',
  });



  return (
    <div className="App">
      
      <div className='main'>
      <Nav/>
      <Hero/>
      <button  className="googleSigninButton" onClick={() => login()}>Google sign in</button>
      </div>
      <Contact/>
    </div>

  );
}

export default App;
