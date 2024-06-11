import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Logout = () => {
  const history = useNavigate();

  useEffect(() => {
    Cookies.remove('user_id');
    Cookies.remove('session_id');
    history.push('/login');
  }, [history]);

  return (
    <div>
      Logging out...
    </div>
  );
};

export default Logout;
