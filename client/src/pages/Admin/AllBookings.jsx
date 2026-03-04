import React, { useEffect, useState } from 'react'
import Title from '../../components/Title';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const AllBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // Fetch all bookings from backend API
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log(localStorage.getItem("token"));

        const { data } = await axios.get(
          "http://localhost:5000/api/v1/admin/all-bookings",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBookings(data.bookings || data);
      } catch (error) {
        console.log("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, []);

  // 🟢 Function to calculate event status
  const getEventStatus = (date) => {
    const today = new Date();
    const eventDate = new Date(date);

    if (eventDate.toDateString() === today.toDateString()) {
      return "Ongoing";
    } else if (eventDate > today) {
      return "Upcoming";
    } else {
      return "Completed";
    }
  };

  return (
    <>
    <div className='fixed  w-full bg-gradient-to-r from-[#51abcc] to-[#0f7397] text-white p-4 shadow-md'>
          <h2 className='text-3xl font-bold'>All Bookings</h2>
          </div>
    <div className='mt-20'>
      <Title
        align="left"
        font="outfit"
        subTitle="One place for all bookings: View, manage, and control every event with ease and precision."
      />

      <div className="overflow-x-auto mt-4">
        <table className="min-w-full border border-gray-300 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              {/* Desktop fields */}
              <th className="py-2 px-4 border-b">User Name</th>
              <th className="py-2 px-4 border-b hidden md:table-cell">Event Name</th>
              <th className="py-2 px-4 border-b hidden md:table-cell">Payment Status</th>
              <th className="py-2 px-4 border-b">Event Date</th>
              <th className="py-2 px-4 border-b hidden md:table-cell">Status</th>
              <th className='py-2 px-4 border-b hidden md:table-cell'>Cancel Request</th>

              <th className="py-2 px-4 border-b">Details</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((b, idx) => (
              <tr key={idx} className="text-sm text-gray-700">
                {/* Mobile par hide ho jaye */}
                <td className="py-2 px-4 border-b">{b.name}</td>

                <td className="py-2 px-4 border-b">{b.eventType}</td>

                <td
                  className={`py-2 px-4 border-b text-center hidden md:table-cell ${
                    b.paymentStatus === "Success"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {b.paymentStatus === "Success" ? "Completed" : "Pending"}
                </td>

                <td className="py-2 px-4 border-b text-center hidden md:table-cell ">{b.date}</td>

                {/* Status column */}
                <td className="py-2 px-4 border-b hidden md:table-cell text-center">
                  {getEventStatus(b.date)}
                </td>
                  <td className='py-2 px-4 border-b hidden md:table-cell text-center'>{b.cancelRequest}</td>

                <td className="py-2 px-4 border-b text-center">
                  <button
                  onClick={() => navigate(`/admin/booking/${b._id}`)}
                   className="px-2 py-1 bg-[#c9cdd2] text-[#23a8d8] rounded">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
}

export default AllBookings;