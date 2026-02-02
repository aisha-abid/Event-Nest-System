// AdminChatPage.jsx
import { useParams, Link , useLocation} from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import ChatWindow from "./ChatWindow";
import { FiArrowLeft } from "react-icons/fi";

const AdminChatPage = () => {
  const { state } = useLocation();
  const user = state?.user;  // yahan se name, _id directly mil jayega

  if (!user) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="h-screen flex flex-col w-full">
      {/* Header */}
      <div className=" fixed z-50 flex items-center p-3 bg-[#51abcc] text-white shadow-md w-full">
       
        <Link to="/admin/messages" className="mr-4">
          <FiArrowLeft className="h-6 w-6" /> 
        </Link>
          <div className="p-4 bg-[#51abcc] text-center text-white font-semibold">
        Chat with {user.name}
      </div>
      </div>
      

      {/* Chat Window */}
      <div className="flex-1 mt-22">
        <ChatWindow user={user} />
      </div>
    </div>
  );
};

export default AdminChatPage;






