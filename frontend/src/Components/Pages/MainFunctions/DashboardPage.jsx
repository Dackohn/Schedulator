import React, { useEffect, useState } from 'react';
import Sidebar from '../Sidebar';
import { FaUsers, FaBook, FaChalkboardTeacher } from 'react-icons/fa';
import './MainFunctions.css';

function DashboardPage() {
  const [stats, setStats] = useState({ groups: 0, courses: 0, professors: 0 });

  useEffect(() => {
    // Fetch the stats data from the server
    fetch('http://localhost:5000/dashboard', { method: 'GET', credentials: 'include' })
      .then(response => response.json())
      .then(data => setStats(data))
      .catch(error => console.error('Error fetching stats:', error));
  }, []);

  return (
    <div className='app_container'>
      <Sidebar />
      <div className='content_wrapper'>
        <div className='dashboard_container'>
          <div className='dashboard_stats'>
            <div className='stat_box'>
              <FaUsers className='icon' />
              <div className='number'>{stats.groups}</div>
              <div className='label'>Groups</div>
            </div>
            <div className='stat_box'>
              <FaBook className='icon' />
              <div className='number'>{stats.courses}</div>
              <div className='label'>Courses</div>
            </div>
            <div className='stat_box'>
              <FaChalkboardTeacher className='icon' />
              <div className='number'>{stats.professors}</div>
              <div className='label'>Professors</div>
            </div>
          </div>
          <div className='notifications'>
            <h2>Notifications</h2>
            11.06.2024 : A new schedule for the next semester available. Don't forget to download it.
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
