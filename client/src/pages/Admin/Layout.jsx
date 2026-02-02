import React from 'react'
import NavBar from '../../components/Admin/NavBar'
import SideBar from '../../components/Admin/SideBar'
import { Outlet } from 'react-router-dom'


const Layout = () => {

  return (
    
    <div className='flex flex-col h-screen'>

     <div className='flex h-full'>
       <SideBar/> 
       <div className='md:ml-64 flex-1 p-4  md:px-10 h-full ml-16'>
        <Outlet/>
       </div>
     </div>
    </div>
  )
}

export default Layout