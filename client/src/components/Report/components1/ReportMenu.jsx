import React from 'react';
import {Link} from 'react-router-dom'


import './custom.scss'
import { ProSidebar, Menu, MenuItem, SidebarContent } from 'react-pro-sidebar';
//import 'react-pro-sidebar/dist/css/styles.css';

import { GoIssueClosed } from 'react-icons/go'
import { BiTimeFive } from 'react-icons/bi'
import { AiOutlineSchedule } from 'react-icons/ai'



function ReportMenu() {

    
    
    return(
    <ProSidebar breakpoint="xl">
      <SidebarContent>
        <Menu iconShape="circle">
        
        
        <MenuItem icon={<BiTimeFive/>}>
            Time Spent
        <Link to="/Report1" />
        </MenuItem>
        <MenuItem icon={<GoIssueClosed />}>
            Closed Tasks
        <Link to="/Report1/Closed" />
        </MenuItem>
        <MenuItem icon={<AiOutlineSchedule />}>
            Schedule
        <Link to="/Report1/Schedule" />
        </MenuItem>
      </Menu>
      </SidebarContent>
      <div style={{height: '80vh', display: 'inline'}}></div>
      
    </ProSidebar>
    ) 
}

export default ReportMenu;