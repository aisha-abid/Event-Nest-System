import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FiSend } from "react-icons/fi";
import { io } from "socket.io-client";
import { SOCKET_URL } from "../config/api";

const CustomerMessages = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const userId = user?._id;

  // --- Helper to avoid duplicate messages ---
  const addMessageUnique = (msg) => {
    setMessages((prev) => {
      if (!msg?._id) return prev;
      if (prev.some((m) => m._id === msg._id)) return prev;
      return [...prev, msg];
    });
  };

  // --- Fetch initial messages ---
  useEffect(() => {
    if (!token) return;
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`/api/v1/messages`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data.messages || []);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };
    fetchMessages();
  }, [token]);

  // --- Socket setup ---
  useEffect(() => {
    if (!token) return;

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket"],
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      socket.emit("joinRoom", { room: userId });
    });

    socket.on("newMessage", (msg) => {
      addMessageUnique(msg);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token, userId]);

  // --- Auto scroll ---
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- Send message ---
  const handleSend = async () => {
    if (!newMessage.trim()) return;

    try {
      // 1. Save in DB
      const res = await axios.post(
        "/api/v1/messages",
        { text: newMessage ,sender: "customer"},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const savedMsg = res.data.message;

      // 2. Emit to server (optional, admin will receive)
      socketRef.current.emit("sendMessage", savedMsg);

      // 3. Add to local state
      addMessageUnique(savedMsg);
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 fixed w-full">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-[#51abcc] to-cyan-500 text-white shadow-md ">
        <h2 className="text-lg font-semibold">Chat with Admin</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`flex-1 p-4 ${msg.sender === "admin" ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`relative max-w-xs p-2 rounded-lg break-words  ${
                msg.sender === "admin"
                  ? "bg-gray-200 text-gray-900 mr-auto"
                  : "bg-[#51abcc] text-white ml-auto"
              }`}
            >
              <div className="whitespace-pre-wrap break-words mb-2">{msg.text}</div>
              <span className="text-xs text-gray-600 absolute right-2 mt-2">
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className=" bg-white border-t flex items-center gap-2 mb-5">
        <input
          type="text"
          className=" ml-2 flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black mt-2"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className=" bg-[#51abcc] hover:bg-cyan-500 text-white p-3 rounded-full transition duration-300"
        >
          <FiSend size={18} />
        </button>
      </div>
    </div>
  );
};

export default CustomerMessages;


