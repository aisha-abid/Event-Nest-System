import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
   <footer className="bg-[#F6F9FC] text-gray-500/80 pt-8 px-6  md:px-16 lg:px-24 xl:px-32 w-full ">
            <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-500/30 pb-6">
                <div className="md:max-w-96">
                    {/* logo insert karo yaha par */}
                    <img src={assets.logoEvent} alt="logo" className={`h-9`} />
                    <p className="mt-6 text-sm">
                        🎉 EventNest is your trusted partner in creating unforgettable experiences. 
                        Whether it’s a birthday, wedding, or corporate event, we simplify the process 
                        so you can focus on celebrating.
                    </p>
                </div>
                <div className="flex-1 flex items-start md:justify-end gap-20">
                    <div>
                        <h2 className="font-semibold mb-5 text-gray-800">Company</h2>
                        <ul className="text-sm space-y-2">
                            <li><a href="#">Home</a></li>
                            <li><a href="#">About us</a></li>
                            <li><a href="#">Contact us</a></li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="font-semibold mb-5 text-gray-800">Get in touch</h2>
                        <div className="text-sm space-y-2">
                            <p>+1-212-456-7890</p>
                            <p>contact@example.com</p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
  )
}

export default Footer