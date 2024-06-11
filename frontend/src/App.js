import React, {useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import {LoginSignup} from './Components/Pages/Login-Signup/LoginSignup';
import {LoginPage} from './Components/Pages/Login-Signup/LoginPage';
import {RegisterPage} from './Components/Pages/Login-Signup/RegisterPage';
import {NotFound} from './Components/Pages/NotFound';
import Cookies from 'js-cookie';
import DashboardPage from './Components/Pages/MainFunctions/DashboardPage';
import RoomsPage from './Components/Pages/MainFunctions/RoomsPage';
import GroupsPage from './Components/Pages/MainFunctions/GroupsPage';
import ProfessorsPage from './Components/Pages/MainFunctions/ProfessorsPage';
import CoursesPage from './Components/Pages/MainFunctions/CoursesPage';
import DownloadPage from './Components/Pages/MainFunctions/DownloadPage';
import Logout from './Components/Pages/MainFunctions/Logout'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<LoginRedirectWrapper />} />
        <Route path="/" exact element={<LoginSignup />} />
        <Route path="/login" exact element={<LoginPage />} />
        <Route path="/register" exact element={<RegisterPage />} />
        <Route path="/logout" component={Logout} />
        <Route path="/dashboard" exact element={<DashboardPage />} />
        <Route path="/rooms" exact element={<RoomsPage />} />
        <Route path="/groups" exact element={<GroupsPage />} />
        <Route path="/professors" exact element={<ProfessorsPage />} />
        <Route path="/courses" exact element={<CoursesPage />} />
        <Route path="/download" exact element={<DownloadPage />} />
        <Route path="*" exact element={<NotFound />} />
      </Routes>
    </Router>
  );
}

const LoginRedirectWrapper = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userId = Cookies.get('user_id');
    const sessionId = Cookies.get('session_id');
    if (userId && sessionId) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return <LoginSignup />;
};

export default App;
