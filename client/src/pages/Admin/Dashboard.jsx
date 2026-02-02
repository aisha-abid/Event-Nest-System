import React, { useEffect, useState } from 'react'
import Title from '../../components/Title'
import { assets} from '../../assets/assets'
import { FiCalendar, FiXCircle } from "react-icons/fi";
import axios from 'axios';

const Dashboard = () => {
      
    const [dashboardData, setDashboardData]=useState({
        totalBookings:0,
        cancelRequests:0,
        recentBookings:[]
    });

    useEffect(() => {
        const fetchDashboardStats =async () =>{
            try{
                const token = localStorage.getItem("token");
                const res = await axios.get("/api/v1/admin/dashboard-stats",{
                headers: { Authorization: `Bearer ${token}` }
                });
                setDashboardData(res.data);
            }
            catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
        };
        fetchDashboardStats();
    }, []);

  return (
    <>
    <div className='fixed  w-full bg-gradient-to-r from-[#51abcc] to-[#0f7397] text-white p-4 shadow-md'>
          <h2 className='text-3xl font-bold'>Dashboard</h2>
          </div>
    <div className='mt-20'>
        
        <Title  text='#b4bec7' align='left' font="outfit"
        subTitle="Take control of your events with precision and ease: Manage, plan, and execute with confidence."/>

        <div className='flex gap-4 my-8'>
            {/* Total Bookings */}
            <div className='bg-[#f9fafb] border border-[#b4bec7] rounded flex items-start  p-4 pr-8 '>
            <div className='flex items-center justify-center bg-[#d3e6f9] rounded px-2 py-2 '>
                <FiCalendar className="text-[#23a8d8] w-5 h-5" />
            </div>
            
            <div className='flex flex-col sm:ml-4 font-medium'>
                <p className='text-[#23a8d8] text-lg'>All Bookings</p>
                <p className='text-neutral-400 text-base'>{dashboardData.totalBookings}</p>
            </div>
            </div>

             {/* Cancel Requests */}
             <div className='bg-[#f9fafb] border border-[#b4bec7] rounded flex items-start p-4 pr-8'>
         <div className='flex items-center justify-center bg-[#d3e6f9] rounded px-2 py-2'>
                <FiXCircle className="text-[#23a8d8] w-5 h-5" />
            </div>
            <div className='flex flex-col sm:ml-4 font-medium'>
                <p className='text-[#23a8d8] text-lg'>Cancel Requests</p>
                <p className='text-neutral-400 text-base'>{dashboardData.cancelRequests}</p>
            </div>
            </div>
        </div>

        {/* Recent Bookings */}
        <h2 className='text-xl text-blue-950/70 font-medium mb-5'>Recent Bookings</h2>

        <div className='w-full max-w-3xl text-left border border-gray-300
        rounded-lg  overflow-y-scroll  pb-4'>

            <table className='w-full'>
                <thead className='bg-gray-50'>
                <tr>
                    <th className='py-3 px-4 text-gray-800 font-medium'>User Name</th>
                    <th className='py-3 px-4 text-gray-800 font-medium
                    max-sm:hidden'>Event Name</th>
                    <th className='py-3 px-4 text-gray-800 font-medium
                    text-center'>Total Amount</th>
                    <th className='py-3 px-4 text-gray-800 font-medium
                    text-center'>Payment Status</th>
                </tr>
                </thead>
                 
                 <tbody className="text-sm">
  {dashboardData.recentBookings && dashboardData.recentBookings.length > 0 ? (
    dashboardData.recentBookings.map((booking, index) => (
      <tr key={index} className="border-t">
        <td className="py-3 px-4 text-gray-700">{booking.userId?.name || "N/A"}</td>
        <td className="py-3 px-4 text-gray-700 max-sm:hidden">{booking.eventType || "N/A"}</td>
        <td className="py-3 px-4 text-gray-700 text-center">
          {booking.totalPrice ? `$ ${booking.totalPrice}` : "—"}
        </td>
        <td className='py-3 px-4 border-t border-gray-300 flex'>
        <button
          className={`py-1 px-3 text-xs rounded-full mx-auto ${
            booking.paymentStatus === "Success"
              ? "bg-green-200 text-green-600"
              : "bg-amber-200 text-yellow-600"
          }`}
        >
          {booking.paymentStatus || "Pending"}
          </button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="4" className="py-4 text-center text-gray-400">
        No recent bookings found
      </td>
    </tr>
  )}
</tbody>


            </table>
        </div>
    </div>
    </>
  )
}

export default Dashboard