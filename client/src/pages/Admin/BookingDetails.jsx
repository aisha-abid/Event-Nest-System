//beautiful design
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const BookingDetails = ({ fetchBookings }) => {
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
    // ✅ state for modal
  const [selectedBooking, setSelectedBooking] = useState(null);

  const handleCancelAction = async (action) => {
    // Optimistic UI update
  setBooking((prev) => ({ ...prev, cancelRequest: action }));
    
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `/api/v1/admin/booking/${id}/cancel-request`,
        { action },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (fetchBookings) fetchBookings();
      alert(`Cancel request ${action} successfully!`);
    } catch (error) {
      console.error("Error handling cancel request:", error);
      alert("Failed to update cancel request.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          `https://localhost:5000/api/v1/admin/booking/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBooking(data.booking);
      } catch (error) {
        console.log("Error fetching booking:", error);
      }
    };
    fetchBooking();
  }, [id]);

  if (!booking) return <p className="p-4">Loading booking details...</p>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-6 border">
        <h1 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-6">
          Booking Details
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DetailCard label="User Name" value={booking.name} />
          <DetailCard label="Phone" value={booking.phone} />
          {/* <DetailCard label="Email" value={booking.email} /> */}
          <DetailCard label="Event Type" value={booking.eventType} />
          <DetailCard label="Event Date" value={booking.date} />
          <DetailCard label="Event Time" value={booking.time} />
          <DetailCard label="Guests" value={booking.guests} />


         <DetailCard
  label="Food"
  value={
    <div>
       <span className="font-semibold">{booking.foodPackage?.toUpperCase()}</span>
  <button 
    className="ml-2 bg-[#2cc8e9] px-2 py-2 rounded text-white"
    onClick={() => setSelectedBooking(booking)}
  >
    View
  </button>

  {/* {booking.foodPackage === "custom" && booking.selectedDishes?.length > 0 && (
    <ul className="mt-1 text-sm text-left list-disc list-inside">
      {booking.selectedDishes.map((dish, i) => (
        <li key={i}>
          {dish.food?.name || "Dish"} x {dish.quantity} ({dish.category || "N/A"})
        </li>
      ))}
    </ul>
  )} */}
    </div>
  }
/>



          <DetailCard label="Decoration" value={booking.decoration} />
          <DetailCard label="Payment Status" value={booking.paymentStatus} />
          <DetailCard label="Status" value={booking.status} />
          <DetailCard label="Cancel Request" value={booking.cancelRequest} />
          {/* <DetailCard
  label="Cancel Request"
  value={
    booking.cancelRequest === "Pending" ? (
      <div className="flex gap-3">
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-md shadow-sm"
          onClick={() => handleCancelAction("Accepted")}
          disabled={loading}
        >
          {loading ? "Processing..." : "✅ Accept"}
        </button>
        <button
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md shadow-sm"
          onClick={() => handleCancelAction("Rejected")}
          disabled={loading}
        >
          {loading ? "Processing..." : "❌ Reject"}
        </button>
      </div>
    ) : booking.cancelRequest === "Accepted" ? (
      <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-700 font-medium">
        ✅ Accepted
      </span>
    ) : booking.cancelRequest === "Rejected" ? (
      <span className="px-3 py-1 text-sm rounded-full bg-red-100 text-red-700 font-medium">
        ❌ Rejected
      </span>
    ) : (
      <span className="text-gray-500">No Request</span>
    )
  }
/> */}
<DetailCard
            label="Cancel Request"
            value={
              booking.cancelRequest === "Pending" ? (
                <div className="flex gap-3">
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-md shadow-sm"
                    onClick={() => handleCancelAction("Accepted")}
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "✅ Accept"}
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md shadow-sm"
                    onClick={() => handleCancelAction("Rejected")}
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "❌ Reject"}
                  </button>
                </div>
              ) : booking.cancelRequest === "Accepted" ? (
                <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-700 font-medium">
                  ✅ Accepted
                </span>
              ) : booking.cancelRequest === "Rejected" ? (
                <span className="px-3 py-1 text-sm rounded-full bg-red-100 text-red-700 font-medium">
                  ❌ Rejected
                </span>
              ) : (
                <span className="text-gray-500">No Request</span>
              )
            }
          />
          {selectedBooking && (
  <div className="fixed z-100 inset-0 flex items-center justify-center bg-transparent bg-opacity-50">
    <div className="bg-gray-200 p-6 rounded-lg shadow-lg w-full max-w-150 max-h-[90vh] overflow-y-auto">
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

        </div>
      </div>
    </div>
  );
  
};

const DetailCard = ({ label, value }) => (
  <div className="bg-gray-100 rounded-lg p-4 shadow-sm">
    <p className="text-sm text-gray-500">{label}</p>
    {typeof value === "string" || typeof value === "number" ? (
      <p className="text-base font-semibold text-gray-800">{value}</p>
    ) : (
      <div className="text-base font-semibold text-gray-800">{value}</div>
    )}

  </div>
);

export default BookingDetails;



