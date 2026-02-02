import React from 'react'
import Title from './Title'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const OurMenu = () => {
  const navigate = useNavigate();

  return (
    <div
      id="services"
      className="flex flex-col mt-20 mb-20 bg-[#f4f7f9] pt-10 pb-10"
    >
      <Title
        title="Our Menu"
        subTitle="We offer three flexible packages to make your event special: Silver Package for a budget-friendly choice, Gold Package for a premium experience, and Custom Package where you choose dishes as per your taste."
      />

      <div className="flex flex-col md:flex-row items-center justify-center gap-8 pt-12">
        {/* Silver Package */}
        <div className="max-w-72 w-full rounded-2xl shadow-md overflow-hidden hover:scale-105 transition duration-300">
          <img className="w-full h-40 object-cover" src={assets.silver} alt="" />
          <div className="p-4">
            <h1 className="text-xl font-semibold mb-3 text-gray-800">Silver Package   <span className="text-sm text-gray-500">(USD 100 / head)</span></h1>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
              <li>2 Starters</li>
              <li>2 Main Course</li>
              <li>2 Salads</li>
              <li>2 Dessert</li>
              <li>2 Drinks</li>
              <li>2 Beverages</li>
            </ul>
          </div>
        </div>

        {/* Gold Package - Highlighted */}
        <div className="max-w-72 w-full rounded-2xl shadow-lg  overflow-hidden hover:scale-105 transition duration-300">
           <img className="w-full h-40 object-cover" src={assets.food} alt="" />
          <div className="p-4">
            <h1 className="text-xl font-semibold mb-3 text-gray-900">Gold Package   <span className="text-sm text-gray-500">(USD 150 / head)</span></h1>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>3 Starters</li>
              <li>3 Main Course</li>
              <li>3 Salads</li>
              <li>3 Deserts</li>
              <li>3 Drinks</li>
              <li>3 Beverages</li>
            </ul>
          </div>
        </div>

        {/* Custom Package - Special */}
        <div className="max-w-72 w-full rounded-2xl shadow-lg overflow-hidden hover:scale-105 transition duration-300">
          <img className="w-full h-40 object-cover" src={assets.custom} alt="" />
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-xl font-semibold">Custom Package<span className="text-sm text-gray-500">   (Flexible)</span></h1>
              
            </div>
            <p className="text-sm leading-relaxed  text-gray-700 space-y-1" >
              In our Custom Package, customers can select as many dishes as they want 
              from different categories to design their own personalized menu.
            </p>
            <button
                onClick={() => navigate('/menu')}
                className="py-2 px-4 bg-cyan-300 text-white font-medium rounded-full hover:bg-cyan-400 transition mt-3"
              >
                Explore Menu
              </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OurMenu
