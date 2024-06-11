import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {LoginSignup} from './Components/Pages/Login-Signup/LoginSignup';
import {LoginPage} from './Components/Pages/Login-Signup/LoginPage';
import {RegisterPage} from './Components/Pages/Login-Signup/RegisterPage';
import {NotFound} from './Components/Pages/NotFound';
import DashboardPage from './Components/Pages/MainFunctions/DashboardPage';
import RoomsPage from './Components/Pages/MainFunctions/RoomsPage';
import GroupsPage from './Components/Pages/MainFunctions/GroupsPage';
import ProfessorsPage from './Components/Pages/MainFunctions/ProfessorsPage';
import CoursesPage from './Components/Pages/MainFunctions/CoursesPage';
import DownloadPage from './Components/Pages/MainFunctions/DownloadPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<LoginSignup />} />
        <Route path="/login" exact element={<LoginPage />} />
        <Route path="/register" exact element={<RegisterPage />} />
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

export default App;
