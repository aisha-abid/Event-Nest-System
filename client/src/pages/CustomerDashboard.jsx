import React, { useEffect, useState } from 'react';
import Title from '../components/Title';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaHourglass  } from "react-icons/fa"; 
import { packageRules } from '../config/packages'

const CustomerDashboard = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const navigate = useNavigate(); 
  // ✅ state for modal
const [selectedBooking, setSelectedBooking] = useState(null);


  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
         console.log("Token:", token);
        if (!token) throw new Error("Please login first");

        const { data } = await axios.get("/api/v1/bookings/my-bookings", {
          headers: { Authorization: `Bearer ${token}` }
        });

        setBookings(data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError(err.response?.data?.message || err.message || "Failed to fetch bookings.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchBookings();
  }, [user]);


  


  const handleRefund = async (bookingId) => {
  try {
    console.log("👉 Sending bookingId to backend:", bookingId);
    const token = localStorage.getItem("token");

    const res = await axios.post(
      `https://localhost:5000/api/v1/refund`,
      { bookingId },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setBookings((prev) =>
      prev.map((b) =>
        b._id === bookingId
          ? { ...b, paymentStatus: "Refunded", status: "Cancelled", refundStatus: "Refunded" }
          : b
      )
    );

    // Step 2: Few seconds baad delete kar do
    setTimeout(async () => {
      await axios.delete(`/api/v1/bookings/${bookingId}`);
      setBookings((prev) => prev.filter((b) => b._id !== bookingId));
    }, 2500); // 2.5 seconds baad delete hoga

    toast.success("Refund processed successfully!",{
       duration: 4000, 
    });
    toast.success("Refund successful!",{
       duration: 4000, 
    });
  } catch (error) {
    console.error("Refund error:", error);
    toast.error(error.response?.data?.message || "Refund failed");
  }
};
const handleCancelConfirm = async () => {
  if (!selectedBookingId) return;

  try {
    const token = localStorage.getItem("token");

    // 1. pehle booking detail le aao (taake check kar sako paid hai ya unpaid)
    const bookingRes = await axios.get(`/api/v1/customers/${selectedBookingId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const booking = bookingRes.data;

    if (booking.paymentStatus === "Paid") {
      // 🔹 Paid → sirf cancelRequest ko Pending karo (PATCH)
      const res = await axios.patch(
        `/api/v1/customers/${selectedBookingId}/cancel`,
        { cancelRequest: "Pending" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.cancelRequest === "Pending") {
        setBookings(prev =>
          prev.map(b =>
            b._id === selectedBookingId
              ? { ...b, cancelRequest: "Pending" }
              : b
          )
        );

        toast("Your cancel request has been sent to admin. Refund will be processed if approved.", {
          duration: 8000,
        });
        
      }
    } else {
      // 🔹 Unpaid → direct delete
      const res = await axios.delete(
        `/api/v1/customers/delete/${selectedBookingId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBookings(prev => prev.filter(b => b._id !== selectedBookingId));
      toast(res.data?.message || "Booking canceled successfully!", {
        duration: 5000,
      });
    }
  } catch (error) {
    console.log("❌ Cancel booking error full:", error);
    toast(error.response?.data?.message || "Failed to cancel booking");
  } finally {
    setShowConfirm(false);
    setSelectedBookingId(null);
  }
};

  
  if (loading) return <p>Loading your bookings...</p>;
  if (error) return <p>{error}</p>;

  return (
    //large Screen + Table view
    <div className='mt-10 py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32'>
      <Title title="My Bookings" subTitle='Welcome to your dashboard. Here you can view your upcoming bookings, payment status, and manage your cancellation requests.' align='left' />

      <div 
      className='hidden lg:block mt-5 w-full text-left border border-gray-300 rounded-lg overflow-x-auto'
      >
        <table className='w-full'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='py-3 px-4 text-gray-800 font-medium'>Name</th>
              <th className='py-3 px-4 text-gray-800 font-medium'>Event</th>
              <th className='py-3 px-4 text-gray-800 font-medium text-center'>Date</th>
              <th className='py-3 px-4 text-gray-800 font-medium text-center'>Time</th>
              <th className='py-3 px-4 text-gray-800 font-medium text-center'>Guests</th>
              <th className='py-3 px-4 text-gray-800 font-medium text-center'>Food</th>
              <th className='py-3 px-4 text-gray-800 font-medium text-center'>Decoration</th>
              <th className='py-3 px-4 text-gray-800 font-medium text-center'>Actions</th>
            </tr>
          </thead>

          <tbody className='text-sm'>
            {bookings.map((item, index) => (
              <tr key={index}>
                 <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>{item.name}</td>
                <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>{item.eventType}</td>
                <td className='py-3 px-4 text-gray-700 border-t border-gray-300 text-center'>{item.date}</td>
                <td className='py-3 px-4 text-gray-700 border-t border-gray-300 text-center'>{item.time}</td>
                <td className='py-3 px-4 text-gray-700 border-t border-gray-300 text-center'>{item.guests}</td>


<td className='py-3 px-4 text-gray-700 border-t border-gray-300 text-center'>
  <span className="font-semibold"></span>
  <button 
    className="ml-2 bg-[#2cc8e9] px-2 py-2 rounded text-white"
    onClick={() =>{
       console.log("👉 Selected booking:", item);
    setSelectedBooking(item)}
    }
  >
    View
  </button>

 
</td>


                <td className='py-3 px-4 text-gray-700 border-t border-gray-300 text-center'>{item.decoration}</td>
                <td className='py-3 px-4 border-t border-gray-300 flex justify-center items-center gap-2'>
  {item.cancelRequest === "Pending" ? (
    <>
    <button 
            className=" bg-yellow-100 text-yellow-700 border border-yellow-300 px-3 py-1 rounded cursor-not-allowed"
            onClick={() => navigate(`/update-bookings/${item._id}`)}
          >
            Edit
          </button>
         
                <button 
            className="bg-green-100 text-green-700 border border-green-300  px-3 py-1 rounded cursor-not-allowed"
          >
            Paid
          </button>
  <button
  className="pr-2 rounded-1xl bg-amber-100 text-amber-700 border border-amber-300 flex items-center justify-center"
>
  <FaHourglass
    title="Cancel Request Pending"
    size={29}
    className="cursor-pointer p-2 bg-yellow-100"
  />
  Pending
</button>

  </>
 

  ) : (
    <>
      {item.paymentStatus === "Pending" && (
        <>
          <button 
            className="bg-yellow-600 text-white px-3 py-1 rounded"
            onClick={() => navigate(`/update-bookings/${item._id}`)}
          >
            Edit
          </button>
          
          <button 
            className="bg-red-600 text-white px-3 py-1 rounded"
            onClick={() => {
              setSelectedBookingId(item._id);
              setShowConfirm(true);
            }}
          >
            Cancel
          </button>
         
                <button 
            className="bg-green-800 text-white px-3 py-1 rounded"
            onClick={() => navigate("/payment", { state: { 
              amount: item.totalPrice, 
              bookingId: item._id, 
              userId: item.userId 
            }})}
          >
            Pay Now
          </button>
        </>
      )}

      {item.paymentStatus === "Success" && (
        <>
          <button 
            className="bg-yellow-100 text-yellow-700 border border-yellow-30 px-3 py-1 border-yellow-3 rounded  cursor-not-allowed"
            onClick={() => navigate(`/update-bookings/${item._id}`)}
          >
            Edit
          </button>
         
                <button 
            className="bg-green-100 text-green-700 border border-green-300bg-gray-400 px-3 py-1 rounded cursor-not-allowed"
          >
            Paid
          </button>
        </>
      )}

      {item.paymentStatus === "Success" && item.cancelRequest !== "Accepted" && item.cancelRequest !== "Rejected" && (
        <button
          className="bg-red-600 text-white px-3 py-1 rounded"
          onClick={() => {
            setSelectedBookingId(item._id);
            setShowConfirm(true);
          }}
        >
          Cancel
        </button>
      )}
      {item.cancelRequest === "Accepted" && (
  <button
  title='Refund Request'
  disabled={item.paymentStatus === "Refunded"}
  onClick={() => handleRefund(item._id)}
  className={`px-3 py-1 rounded ${item.paymentStatus === "Refunded" ? " bg-gray-100 text-gray-600 border border-gray-300bg-gray-400 cursor-not-allowed" : "bg-cyan-700 text-white"}`}>
 {item.refundStatus === "Refunded" ? "Refunded" : "Refund"}
  </button>
)}


{item.cancelRequest === "Rejected" && (
  <button
  title='Refund Request Rejected'
  className={`px-3 py-1 rounded ${item.cancelRequest === "Rejected" ? "bg-red-100 text-red-700 border border-red-300 cursor-not-allowed" : "bg-blue-500 text-white"}`}>
  Rejected
  </button>
)}

    </>
  )}
</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

       {/* ✅ CARDS for Mobile */}
    <div className="lg:hidden mt-5 space-y-4">
      {bookings.map((item, index) => (
        <div key={index} className="border rounded-lg p-4 shadow-sm bg-white">
          <p><span className="font-semibold">Name:</span> {item.name}</p>
          <p><span className="font-semibold">Event:</span> {item.eventType}</p>
          <p><span className="font-semibold">Date:</span> {item.date}</p>
          <p><span className="font-semibold">Time:</span> {item.time}</p>
          <p><span className="font-semibold">Guests:</span> {item.guests}</p>
          <p><span className="font-semibold">Food:</span> 
          <span className="font-semibold">{item.foodPackage?.toUpperCase()}</span>
  <button 
    className="ml-2 bg-[#16adcb] px-2 py-2 rounded text-white"
    onClick={() => setSelectedBooking(item)}
  >
    View
  </button>

   </p>
          <p><span className="font-semibold">Decoration:</span> {item.decoration}</p>

          {/* <div className="flex justify-end gap-4 mt-3 text-xl text-gray-600">
            {item.paymentStatus === "Pending" && (

              <>
                
               <FiEdit 
                 title='Edit your Booking'
                 size={30}
                  className="cursor-pointer p-2 rounded-1xl bg-blue-100 text-blue-500 hover:bg-blue-200 hover:text-blue-700"
                  onClick={() => navigate(`/update-bookings/${item._id}`)} 
                />
                <FiTrash 
                  title='Delete your booking'
                  size={30}
                  className="cursor-pointer p-2 rounded-1xl bg-red-100 text-red-500 hover:bg-red-200 hover:text-red-700" 
                  onClick={() => { setSelectedBookingId(item._id); setShowConfirm(true); }} 
                />

                <FiCreditCard 
                  size={30}
                  className="cursor-pointer p-2 rounded-1xl bg-green-100 text-green-500 hover:bg-green-200 hover:text-green-700"
                  onClick={() => navigate("/payment", { state: { amount: item.totalPrice, bookingId: item._id, userId: item.userId }})} 
                />
                
          
               
               
              </>
            )}
            {item.paymentStatus === "Success" && (

       <button className='pr-2 rounded-1xl bg-amber-100 text-amber-700 border border-amber-300 flex items-center justify-center gap-1 text-sm'>
       <FaHourglass 
    title='Cancel Request Pending'
  size={30} 
  className="cursor-pointer p-2 bg-yellow-100" />Pending</button>
 
            )}
          </div> */}
          <div className="flex justify-end gap-4 mt-3 text-sm">
  {item.cancelRequest === "Pending" ? (
    <>
      <button 
        className="bg-yellow-100 text-yellow-700 border border-yellow-300 px-3 py-1 rounded cursor-not-allowed"
      >
        Edit
      </button>
      <button 
        className="bg-green-100 text-green-700 border border-green-300 px-3 py-1 rounded cursor-not-allowed"
      >
        Paid
      </button>
      <button className="pr-2 rounded bg-amber-100 text-amber-700 border border-amber-300 flex items-center gap-1">
        <FaHourglass size={18} /> Pending
      </button>
    </>
  ) : (
    <>
      {item.paymentStatus === "Pending" && (
        <>
          <button 
            className="bg-yellow-600 text-white px-3 py-1 rounded"
            onClick={() => navigate(`/update-bookings/${item._id}`)}
          >
            Edit
          </button>
          <button 
            className="bg-red-600 text-white px-3 py-1 rounded"
            onClick={() => { setSelectedBookingId(item._id); setShowConfirm(true); }}
          >
            Cancel
          </button>
          <button 
            className="bg-green-800 text-white px-3 py-1 rounded"
            onClick={() => navigate("/payment", { state: { amount: item.totalPrice, bookingId: item._id, userId: item.userId }})}
          >
            Pay Now
          </button>
        </>
      )}

      {item.paymentStatus === "Success" && (
        <>
          <button 
            className="bg-yellow-100 text-yellow-700 border border-yellow-300 px-3 py-1 rounded cursor-not-allowed"
          >
            Edit
          </button>
          <button 
            className="bg-green-100 text-green-700 border border-green-300 px-3 py-1 rounded cursor-not-allowed"
          >
            Paid
          </button>
        </>
      )}

      {item.paymentStatus === "Success" && item.cancelRequest !== "Accepted" && item.cancelRequest !== "Rejected" && (
        <button
          className="bg-red-600 text-white px-3 py-1 rounded"
          onClick={() => { setSelectedBookingId(item._id); setShowConfirm(true); }}
        >
          Cancel
        </button>
      )}

      {item.cancelRequest === "Accepted" && (
        <button
          title="Refund Request"
          disabled={item.paymentStatus === "Refunded"}
          onClick={() => handleRefund(item._id)}
          className={`px-3 py-1 rounded ${item.paymentStatus === "Refunded" ? "bg-gray-100 text-gray-600 border border-gray-300 cursor-not-allowed" : "bg-cyan-700 text-white"}`}
        >
          {item.refundStatus === "Refunded" ? "Refunded" : "Refund"}
        </button>
      )}

      {item.cancelRequest === "Rejected" && (
        <button
          title="Refund Request Rejected"
          className="px-3 py-1 rounded bg-red-100 text-red-700 border border-red-300 cursor-not-allowed"
        >
          Rejected
        </button>
      )}
    </>
  )}
</div>

        </div>
      ))}
    </div>



{selectedBooking && (
  <div className="fixed z-100 inset-0 flex items-center justify-center bg-transparent bg-opacity-50">
    <div className="bg-gray-200 p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
      <h2 className="text-lg font-bold mb-4">Food Details</h2>

      <p className="mb-2">
        <span className="font-semibold">Package:</span> {selectedBooking.foodPackage}
      </p>

      {/* ✅ Category Wise Grouping */}
      {selectedBooking.selectedDishes && selectedBooking.selectedDishes.length > 0 ? (
        Object.entries(
          selectedBooking.selectedDishes.reduce((acc, dish) => {
            const category = dish.food?.category || "Other";
            if (!acc[category]) acc[category] = [];
            acc[category].push(dish);
            return acc;
          }, {})
        ).map(([category, dishes], i) => (
          <div key={i} className="mb-4">
            <h3 className="font-semibold text-cyan-600 border-b pb-1 mb-2">{category}</h3>
            <ul className="space-y-1 text-sm">
              {dishes.map((dish, index) => (
                <li key={index} className="flex justify-between">
                  <span>{dish.food?.name || dish.food} × 1</span>
                  <span className="text-gray-600">
                    {dish.food?.price ? `$ ${dish.food.price} / guest` : ""}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))
      )
       : (
        <p className="text-gray-500 text-sm">No Dishes Selected</p>
      )}


      {/* Close Button */}
      <div className="mt-4 flex justify-end">
        <button 
          className="bg-[#2cc8e9] text-white px-4 py-2 rounded"
          onClick={() => setSelectedBooking(null)}
        >
          Back
        </button>
      </div>
    </div>
  </div>
)}


      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-50">
          <div className="bg-[#a5a2a5] p-6 rounded-lg shadow-lg text-center">
            <p className="text-lg mb-4">Are you sure you want to cancel this booking?</p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-gray-100 px-4 py-2 rounded"
                onClick={() => setShowConfirm(false)}
              >
                No
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded"
                onClick={handleCancelConfirm}
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;




