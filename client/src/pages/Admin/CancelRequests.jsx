import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CancelRequests = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookings, setBookings] = useState([]);
  const bookingList = Array.isArray(bookings) ? bookings : [];

  const fetchCancelRequests = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Please login first");

      const { data } = await axios.get("/api/v1/admin/cancel-req", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ Filter sirf cancel request wali bookings
      const cancelRequests = (data.requests || []).filter(
        (b) =>
          b.cancelRequest === "Pending" ||
          b.cancelRequest === "Accepted" ||
          b.cancelRequest === "Rejected"
      );

      setBookings(cancelRequests);
    } catch (err) {
      console.error("Error fetching cancel requests:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch cancel requests."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCancelRequests();
  }, []);

  // ✅ Cancel Request ko Accept/Reject karna
  const handleCancelAction = async (id, action) => {
    // Optimistically update UI
  setBookings((prev) =>
    prev.map((b) =>
      b._id === id ? { ...b, cancelRequest: action } : b
    )
  );
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/api/v1/admin/booking/${id}/cancel-request`,
        { action },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(`Cancel request ${action}`);
      fetchCancelRequests(); // refresh list
    } catch (err) {
      console.error("Error updating cancel request:", err);
      toast.error("Failed to update cancel request.");
    }
  };

  if (loading) return <p className="p-4">Loading cancel requests...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <>
     <div className='fixed  w-full bg-gradient-to-r from-[#51abcc] to-[#0f7397] text-white p-4 shadow-md'>
          <h2 className='text-3xl font-bold'>Cancel Requests</h2>
          </div>
    <div className="mt-20">
     
      {bookingList.length === 0 ? (
        <p>No cancel requests found.</p>
      ) : (
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 border">Customer</th>
                {/* Event name column hide on mobile */}
                <th className="py-3 px-4 border hidden sm:table-cell">Event</th>
                <th className="py-3 px-4 border">Date</th>
                {/* Cancel Request hide on mobile */}
                <th className="py-3 px-4 border hidden sm:table-cell">
                  Cancel Request
                </th>
                {/* Action hide on mobile */}
                <th className="py-3 px-4 border hidden sm:table-cell">Action</th>
                <th className="py-3 px-4 border">Details</th>
              </tr>
            </thead>
            <tbody>
              {bookingList.map((b) => (
                <tr key={b._id} className="text-center">
                  <td className="py-2 px-4 border">
                    {b.name} ({b.email})
                  </td>
                  {/* Event hide on mobile */}
                  <td className="py-2 px-4 border hidden sm:table-cell">
                    {b.eventType}
                  </td>
                  <td className="py-2 px-4 border">{b.date}</td>
                  {/* Cancel Request hide on mobile */}
                  <td className="py-2 px-4 border font-semibold hidden sm:table-cell">
                    {b.cancelRequest === "Pending" && (
                      <span className="text-yellow-600">⏳ Pending</span>
                    )}
                    {b.cancelRequest === "Accepted" && (
                      <span className="text-green-600">✅ Accepted</span>
                    )}
                    {b.cancelRequest === "Rejected" && (
                      <span className="text-red-600">❌ Rejected</span>
                    )}
                  </td>
                  {/* Action hide on mobile */}
                  <td className="py-2 px-4 border hidden sm:table-cell">
                    {b.cancelRequest === "Pending" ? (
                      <div className="flex justify-center gap-2">
                        <button
                          className="bg-green-500 text-white px-3 py-1 rounded"
                          onClick={() => handleCancelAction(b._id, "Accepted")}
                        >
                          Accept
                        </button>
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded"
                          onClick={() => handleCancelAction(b._id, "Rejected")}
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-500">No Action</span>
                    )}
                  </td>
                  <td className="py-2 px-4 border font-semibold">
                    <button
                      onClick={() => navigate(`/admin/booking/${b._id}`)}
                      className="px-2 py-1 bg-[#c9cdd2] text-[#23a8d8] rounded"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </>
  );
};

export default CancelRequests;
