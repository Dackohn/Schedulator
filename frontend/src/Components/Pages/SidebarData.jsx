import React from 'react'
import DashboardIcon from '@mui/icons-material/Dashboard';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import PersonIcon from '@mui/icons-material/Person';
import ClassIcon from '@mui/icons-material/Class';
import GroupsIcon from '@mui/icons-material/Groups';
import DownloadIcon from '@mui/icons-material/Download';
import LogoutIcon from '@mui/icons-material/Logout';

export const  SidebarData = [
    {
        title:"Dashboard",
        icon:<DashboardIcon />,
        link:"/dashboard"
    },
    {
        title:"Rooms",
        icon:<MeetingRoomIcon />,
        link:"/rooms"
    },
    {
        title:"Professors",
        icon:<PersonIcon />,
        link:"/professors"
    },
    {
        title:"Courses",
        icon:<ClassIcon />,
        link:"/courses"
    },
    {
        title:"Groups",
        icon:<GroupsIcon />,
        link:"/groups"
    },
    {
        title:"Download",
        icon:<DownloadIcon />,
        link:"/download"
    },
    {
        title:"Logout",
        icon:<LogoutIcon/>,
        link:"/logout"
    }
]
  

