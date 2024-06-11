import React from 'react';
import Sidebar from '../Sidebar';
import './MainFunctions.css';
import { FaDownload } from 'react-icons/fa';
import weekScheduleImg from '../../Assets/weekly_schedule.png';
import dayScheduleImg from '../../Assets/thursday.png';

function DownloadButtons() {
  const handleDownload = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div className="download-buttons">
      <div className="download-button" onClick={() => handleDownload('http://localhost:5000/download/week-schedule')}>
        <img src={weekScheduleImg} alt="Week Schedule" />
        <div className="overlay">
          <FaDownload className="icon" />
          <div className="text">Week Schedule</div>
        </div>
      </div>
      <div className="download-button" onClick={() => handleDownload('http://localhost:5000/download/day-schedule')}>
        <img src={dayScheduleImg} alt="Day Schedule" />
        <div className="overlay">
          <FaDownload className="icon" />
          <div className="text">Day Schedule</div>
        </div>
      </div>
    </div>
  );
}

function DownloadPage() {
  return (
    <div className='app_container'>
      <Sidebar />
      <div className='content_wrapper'>
        <div className="download_container">
          <DownloadButtons />
          <div className='notifications'>
              <h2>Notifications</h2>
              11.06.2024 : A new schedule for the next semester available. Don't forget to download it.
            </div>  
          </div>
      </div>
    </div>
  );
}

export default DownloadPage;
