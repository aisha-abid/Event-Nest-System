import React from 'react'
import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'
import { FiGrid, FiList, FiAlertCircle, FiMessageCircle, FiHome } from "react-icons/fi";

const SideBar = () => {
    const sidebarLinks=[
      {name:"Go to Home", path:"/",icon:<FiHome className="w-6 h-6" />},
      {name:"Dashboard", path:"/admin",icon:<FiGrid className="w-6 h-6" />},
      {name:"All Bookings", path:"/admin/all-bookings",icon:<FiList className="w-6 h-6" />},
      {name:"Cancel Requests", path:"/admin/cancel-req",icon:<FiAlertCircle className="w-6 h-6" />},
      {name:"Messages", path:"/admin/messages",icon:<FiMessageCircle className="w-6 h-6" />},
    ]
    
  return (
    <div className='md:w-64 w-16 border-r h-full bg-gray-100 text-base border-gray-300 pt-5
    flex flex-col transition-all duration-300 fixed'>
      
    {sidebarLinks.map((item,index)=>(
       <NavLink to={item.path} key={index} end="/admin" className={({isActive})=>`flex
       items-center py-3 px-4 md:px-8 gap3 ${isActive ? "border-r-4 md:border-r-[6px] bg-[#d3e6f9] border-[#23a8d8] text-[#23a8d8]":"hover:bg-[#f9fafb] border-white text-gray-700"}`}>
         {item.icon}
         <p className='md:block hidden text-center'>{item.name}</p>
       </NavLink>
    ))}
    </div>
  )
}

export default SideBar