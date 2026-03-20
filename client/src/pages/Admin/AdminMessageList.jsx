
// AdminMessageList.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios'
import { buildApiUrl } from "../../config/api";

const AdminMessageList = () => {
const [users, setUsers] = useState([]);
const userList = Array.isArray(users) ? users : [];
useEffect(() => {
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token"); // <-- add this
      const res = await axios.get(buildApiUrl("/api/v1/messages/users"), {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Response:",res.data); // yahan check karo
      setUsers(Array.isArray(res.data?.users) ? res.data.users : []); // correct key
     
    } catch (err) {
      console.error("Error fetching customers", err);
    }
  };
  fetchUsers();
}, []);


  return (
    <>
    {/* Header */}
      <div className="fixed top-0  w-full bg-gradient-to-r from-[#51abcc] to-[#0f7397] text-white p-4 shadow-md">
        <h2 className="text-2xl font-bold">Messages</h2>
      </div>
    <div className="h-screen bg-gray-200 flex flex-col mt-10">
      

      {/* Customers List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {userList.map((user) => (
          <Link
            key={user._id}
            to={`/admin/messages/${user._id}`}
            state={{ user }} 
            className="flex items-center justify-between p-4 bg-white rounded-xl shadow hover:shadow-2xl transition-shadow duration-300"
          >
            <div className="flex items-center space-x-4">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-[#51abcc] flex items-center justify-center text-white font-bold text-lg">
                {user.name[0]}
              </div>

              {/* Customer info */}
              <div>
                <p className="font-semibold text-gray-800 text-lg">{user.name}</p>
                <p className="text-gray-500 text-sm truncate max-w-xs">
                  {user.lastMessage}
                </p>
              </div>
            </div>

            {/* Unread badge */}
            {user.unreadCount > 0 && (
              <div className=" flex items-center justify-center bg-black text-white text-xs font-semibold px-2 py-1 w-5 h-5 rounded-full">
                {user.unreadCount}
              </div>
            )}
          </Link>
        ))}

        {/* If no customers */}
        {userList.length === 0 && (
          <p className="text-gray-500 text-center mt-10 text-lg">
            No customers found.
          </p>
        )}
      </div>
    </div>
    </>
  );
};

export default AdminMessageList;




