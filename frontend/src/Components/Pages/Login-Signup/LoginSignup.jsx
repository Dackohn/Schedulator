import React from 'react';
import './LoginSignup.css';

export const LoginSignup = () => {
  return (
    <div className='container'>
      <div className="background"></div>
      <div className="header">
        Welcome To Schedule Maker
      </div>
      <div className="buttons">
        <div className="submit-container">
          <div className="start" onClick={() => {window.location.pathname = "/register"}}>Get Started</div>
        </div>
        <div className="login">Have an account? <a href="/login"><button><span>Log In</span></button></a></div>
      </div>
    </div>
  );
};
