import { useState, useRef, useEffect } from "react";
import { FiSend } from "react-icons/fi";
import axios from 'axios'
import { io } from "socket.io-client";
import { SOCKET_URL } from "../../config/api";

//  Make sure VITE_SOCKET_URL is set for the deployed backend/socket origin.

const ChatWindow = ({ user }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  // helper to add unique messages (avoid duplicates)
  const addMessageUnique = (msg) => {
    setMessages((prev) => {
      if (!msg) return prev;
      if (prev.some((m) => m._id && msg._id && m._id === msg._id)) return prev;
      return [...prev, msg];
    });
  };

  // Fetch initial conversation
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`/api/v1/messages/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(res.data.messages || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMessages();
  }, [user._id]);

  // Socket connect
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // connect
    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket"] // optional: prefer websocket
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connect_error:", err.message);
    });

    // When a new message arrives (from server)
    socket.on("newMessage", (msg) => {
      // Only add if the message belongs to this conversation
      // Adjust fields based on your message object (senderId/recipientId)
      if (!msg) return;

      const otherUserId = user._id; // the chat partner's id (customer)
       if (msg.userId === user._id) { // Correct field check
    addMessageUnique(msg);
  }
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user._id]); // reconnect when chatting with different user


  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message to backend
  const sendMessage = async () => {
    if (!newMsg.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `/api/v1/messages/${user._id}/reply`,
        { text: newMsg },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Add new message to state
      setMessages([...messages, res.data.message]);
      setNewMsg("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <>
    <div className=" flex flex-col h-full">
     {/* Messages area (scrollable only) */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2 bg-gray-50" style={{ marginBottom: "70px" }}>
        {messages.map((msg, idx) => {
          const time = new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          return (
            <div
              key={idx}
              className={`p-2 rounded-lg max-w-xs relative ${
                msg.sender === "admin"
                  ? "ml-auto bg-[#51abcc] text-white"
                  : "mr-auto bg-gray-300"
              }`}
            >
              <div className="mb-2">{msg.text}</div>
              <span className="text-xs text-gray-600 absolute bottom-1 right-2 ">{time}</span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input bar (always fixed bottom) */}
      <div className={`
        fixed bottom-0 left-0 right-0 
        md:left-64 md:right-0 w-full md:w-auto px-4 md:px-6 lg:px-16 flex items-center justify-between z-50 
        bg-white/90 shadow-md py-3 
        ${isScrolled ? "bg-white/80 shadow-md text-gray-700 backdrop-blur-lg py-3 md:py-4" : "py-4 md:py-6"}`}>
        <input
          type="text"
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded-lg"
          onKeyDown={(e) => {
          if (e.key === "Enter") {
      e.preventDefault(); // prevent new line
      sendMessage();
    }
  }}
        />
        <button
          onClick={sendMessage}
          className="ml-2 bg-[#23a8d8] text-white p-2 rounded-lg"
        >
          <FiSend />
        </button>
      </div>
    </div>
    </>
  );
};

export default ChatWindow;
