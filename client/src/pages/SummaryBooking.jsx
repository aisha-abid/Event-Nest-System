import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { showCustomToast } from "../utils/toastUtils";
import { buildApiUrl } from "../config/api";

const SummaryBooking = () => {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(buildApiUrl('/api/v1/bookings/my-bookings'), {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data && res.data.length > 0) {
          setBookingData(res.data[0]); // latest booking
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchBooking();
  }, []);

  if (!bookingData) return <div className="text-center mt-20 text-gray-600">Loading booking summary...</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6 mt-12">
      <div className="bg-white shadow-xl p-8 rounded-2xl w-full max-w-lg border border-gray-200">
        {/* Title */}
        <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-700">
          Booking <span className="text-cyan-600">Summary</span>
        </h2>

        {/* Event Details */}
        <div className="space-y-2 text-gray-700">
          <p><span className="font-semibold">Event Name:</span> {bookingData.eventType}</p>
          <p><span className="font-semibold">Guests:</span> {bookingData.guests}</p>
          <p><span className="font-semibold">Decoration:</span> {bookingData.decoration}</p>
          <p><span className="font-semibold">Date & Time:</span> {bookingData.date} at {bookingData.time}</p>
        </div>

        {/* Food Section */}
        <div className="mt-6">
          <h3 className="text-xl font-bold text-gray-800 border-b pb-2 mb-3">Food Selection</h3>
          <p className="mb-2"><span className="font-semibold">Package:</span> {bookingData.foodPackage}</p>

          {bookingData.selectedDishes && bookingData.selectedDishes.length > 0 ? (
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              {bookingData.selectedDishes.map((dish, index) => (
                <li key={index} className="leading-relaxed">
                  {dish.food?.name || dish.food} 
                  <span className="text-sm text-gray-500"> ({dish.food?.category || "N/A"})</span> 
                  <span className="ml-2 text-gray-600">- $ {dish.food?.price} per guest</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No Dishes Selected</p>
          )}
        </div>

        {/* Pricing Summary */}
        <div className="mt-6">
          <h3 className="text-xl font-bold text-gray-800 border-b pb-2 mb-3">Pricing Summary</h3>
          <p><span className="font-semibold">Total Guests:</span> {bookingData.guests}</p>
          <p><span className="font-semibold">Total Food Cost:</span> USD {bookingData.pricePerGuest * bookingData.guests}</p>
          <p><span className="font-semibold">Decoration Cost:</span> USD {bookingData.decorationCost}</p>
          <p className="mt-2 text-lg font-semibold text-gray-900">
            Total Cost: <span className="text-cyan-600">USD {bookingData.totalPrice}</span>
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-8">
          <button
            className="flex-1 px-6 py-3 rounded-lg border border-gray-700 text-gray-700 font-medium hover:bg-gray-700 hover:text-white transition"
            onClick={() =>{
             showCustomToast("You can complete your payment anytime from your Dashboard.", "info");

          navigate("/my-bookings")}
            } 
          >
            Pay Later
          </button>
          <button
            className="flex-1 px-6 py-3 rounded-lg bg-cyan-600 text-white font-medium hover:bg-cyan-700 transition"
            onClick={() =>{
              showCustomToast("You can complete your payment anytime from your Dashboard.", "info");

              navigate("/payment", {
                state: {
                  amount: bookingData.totalPrice,
                  bookingId: bookingData._id,
                  userId: bookingData.user?._id,
                },
              
              })
            }
            }
          >
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default SummaryBooking;

