import React from 'react'
import { SidebarData } from './SidebarData'
import "./Sidebar.css"
import Logo from './Logo.jsx'
function Sidebar() {
  return (
        <div className="page-border">
            <div className="naming-box"></div>
            <div className='logo-container'>
                <Logo />
            </div>
                <div className="Sidebar">
                    <ul className="sidebar_list">
                    {SidebarData.map((val, key) => {
                    return <li className="row" id={window.location.pathname === val.link ? "active": ""} key={key} onClick={() => {window.location.pathname = val.link}}>
                        <div id="icon">{val.icon}</div>
                        <div id="title">{val.title}</div>
                    </li>
                })}</ul></div>
        </div>
    )
    }

export default Sidebar