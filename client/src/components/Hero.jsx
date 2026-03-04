import { assets,  eventTypes } from '../assets/assets'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { showCustomToast } from "../utils/toastUtils";
import toast from "react-hot-toast";


const Hero = () => {
const navigate = useNavigate();

   
    const [formData, setFormData] = useState({
    eventType: "",
    eventDate: "",
    eventTime: "",
    guests: ""
  });
const checkAvailability = async (e) => {
  e.preventDefault();

    // ✅ Step 1: Check if user is logged in
  const token = localStorage.getItem("token");
   console.log("Token found in Hero:", token);
  if (!token) {
    alert("⚠ Please login first to check availability.");
    return;
  }
    // ✅ Step 2: Availability check code
   try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/bookings/check-availability",
        {
          eventDate: formData.eventDate,
          eventTime: formData.eventTime,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.data.available) {
         toast.error("❌ Sorry! Hall is not available at this time.",{
           duration: 4000, 
         });
      } else {
        toast.success("🎉 Hall Available! You can proceed to booking.",{
           duration: 4000, 
        });
        navigate("/booking", { state: { formData } });
      }
}catch (err) {
      console.error(err);
    showCustomToast("⚠ Error checking availability. Please try again.");
    }
  };

   

  return (
    <div id='home' className='flex flex-col items-start justify-center px-6 md:px-16 lg:px:24 xl:px-32 text-black

    bg-[url("/src/assets/heroImage1.jpg")] bg-no-repeat bg-cover bg-center h-screen'>
   
   <p className='bg-[#49B9FF]/50 px-3.5 py-1 rounded-full mt-20'>One Platform. Endless Celebrations.</p>
   <h1 className='font-playfair text-2xl md:text-5xl md:text-[56px] md:leading-[56px] font-bold md:font-extrabold max-w-xl mt-4'>Create Unforgettable  Memories at EventNest</h1>
   
   <form onSubmit={checkAvailability} className='bg-white text-gray-500 rounded-lg px-6 py-4  flex flex-col md:flex-row max-md:items-start gap-4 max-md:mx-auto'>

            <div>
                <div className='flex items-center gap-2'>
                   <img src={assets.calenderIcon} alt="" className='h-4' />
                    <label htmlFor="eventInput">Event Type</label>
                </div>
                <input list='events' id="eventInput" type="text" value={formData.eventType}
                onChange={(e)=>setFormData({...formData, eventType:e.target.value})}
                className=" rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none" placeholder="Type Event Name" required />
                <datalist id='events'>
                {eventTypes.map((event,index)=>(
                  <option value={event} key={index}></option>
                ))}
                </datalist>
            </div>

            <div>
                <div className='flex items-center gap-2'>
                    <img src={assets.calenderIcon} alt="" className='h-4' />
                    <label htmlFor="eventDate">Event Date</label>
                </div>
                <input id="eventDate" type="date"
                value={formData.eventDate}
                onChange={(e)=>setFormData({...formData, eventDate:e.target.value})}
                 min={new Date().toISOString().split("T")[0]}
                className=" rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none" required />
            </div>

            <div>
                <div className='flex items-center gap-2'>
                    <img src={assets.calenderIcon} alt="" className='h-4' />
                    <label htmlFor="eventTime">Event Time</label>
                </div>
                <input id="eventTime" type="time"
                value={formData.eventTime}
                onChange={(e)=>setFormData({...formData, eventTime:e.target.value})}
                className=" rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none" required />
            </div>

            <div className='flex md:flex-col max-md:gap-2 max-md:items-center'>
                <label htmlFor="guests">Guests</label>
                <input min={1} max={2000} id="guests" type="number" 
                value={formData.guests}
                onChange={(e)=>setFormData({...formData, guests:e.target.value})}
                className=" rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none  max-w-16" placeholder="0" />
            </div>

            <button type='submit' className='flex items-center 
               justify-center gap-1 rounded-md bg-black hover:bg-gray-800  transition-colors py-2 px-4 text-white my-auto cursor-pointer max-md:w-full max-md:py-1' >
                <img src={assets.searchIcon} alt="search-icon" className='h-7 md:hidden' />
                <span>Check Availability</span>
            </button>
        </form>
    </div>
  )
}

export default Hero