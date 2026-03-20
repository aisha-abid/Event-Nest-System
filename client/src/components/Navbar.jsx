import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { Link as ScrollLink } from "react-scroll";
import { FiBell } from "react-icons/fi";
import AuthForm from "./AuthForm";
import axios from 'axios'
import { io } from "socket.io-client";
import { showCustomToast } from "../utils/toastUtils";
import { buildApiUrl, SOCKET_URL } from "../config/api";

const BookIcon = () => (
  <svg
    width="26"
    height="26"
    viewBox="0 0 26 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18.75 19.4375V18.0625C18.75 17.3332 18.4603 16.6337 17.9445 16.118C17.4288 15.6022 16.7293 15.3125 16 15.3125H10.5C9.77065 15.3125 9.07118 15.6022 8.55546 16.118C8.03973 16.6337 7.75 17.3332 7.75 18.0625V19.4375M16 9.8125C16 11.3313 14.7688 12.5625 13.25 12.5625C11.7312 12.5625 10.5 11.3313 10.5 9.8125C10.5 8.29372 11.7312 7.0625 13.25 7.0625C14.7688 7.0625 16 8.29372 16 9.8125Z"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Navbar = ({ user= null, onLogout=() => {} , onLogin = () => {} }) => {
  const navLinks = [
    { name: "Home", to: "home" },
    { name: "About", to: "about" },
    { name: "Gallery", to: "gallery" },
    { name: "Services", to: "services" },
  ];

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [showAuth, setShowAuth] = React.useState(false);

  const isHome = location.pathname === "/";
  const isCustomerDashboard = location.pathname === "/my-bookings";
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) onLogin(JSON.parse(storedUser));
  }, [onLogin]);

 

  useEffect(() => {
  if (!user || !isCustomerDashboard) return;

  const socket = io(SOCKET_URL, {
    auth: { token: localStorage.getItem("token") }
  });

  socket.on("newMessage", (msg) => {
    if (msg.sender === "admin") {
      setUnreadCount((prev) => prev + 1); // 🔥 new admin msg => badge ++
       showCustomToast("📩 New message from Admin!");
    }
  });

  return () => socket.disconnect();
}, [user, isCustomerDashboard]);

useEffect(() => {
  // Jab bhi user messages page open kare
  if (location.pathname === "/messages" && user && isCustomerDashboard) {
    setUnreadCount(0);  // ✅ badge reset frontend pe bhi

     // optional: backend pe bhi reset
    const token = localStorage.getItem("token");
    if (token) {
      axios.post(buildApiUrl("/api/v1/messages/mark-read"), {}, {
        headers: { Authorization: `Bearer ${token}` }
      }).catch(err => console.error("Error marking messages as read:", err));
    }
  
  }
}, [location.pathname, user, isCustomerDashboard]);


  useEffect(() => {
    if (location.pathname === "/") {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 10);
      };
      setIsScrolled(window.scrollY > 10);
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    } else {
      setIsScrolled(true);
    }
  }, [location.pathname]);

  useEffect(() => {
  const fetchUnread = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(buildApiUrl("/api/v1/messages/unread-count"), {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUnreadCount(res.data.unreadCount || 0);
    } catch (err) {
      console.error("Error fetching unread count:", err);
    }
  };

  if (user && isCustomerDashboard) {
    fetchUnread();
  }
}, [user, isCustomerDashboard]);

if(location.pathname==="/messages")
  return null;


  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 ${
          isScrolled
            ? "bg-white/80 shadow-md text-gray-700 backdrop-blur-lg py-3 md:py-4"
            : "py-4 md:py-6"
        }`}
      >
        {/* Logo */}
        <Link to="/">
          <img
            src={assets.logoEvent}
            alt="logo"
            className={`h-8 sm:h-10 lg:h-14`}
          />
        </Link>

        {/* Desktop Nav */}
        {isHome && !isCustomerDashboard && (
          <div className="hidden md:flex items-center gap-4 lg:gap-8 lg:text-black">
            {navLinks.map((link, i) => (
              <ScrollLink
                key={i}
                to={link.to}
                smooth={true}
                duration={500}
                spy={true}
                offset={-70}
                className="cursor-pointer hover:text-[#267686]"
              >
                {link.name}
                <div
                  className={`bg-black h-0.5 w-0 group-hover:w-full transition-all duration-300`}
                />
              </ScrollLink>
            ))}

            {user && (
              <button
                className="border px-4 py-1 text-sm font-light rounded-full cursor-pointer text-black transition-all"
                onClick={() => {
                  user.role === "admin"
                    ? navigate("/admin")
                    : navigate("/my-bookings");
                }}
              >
                Dashboard
              </button>
            )}
          </div>
        )}

        {/* Desktop Right */}
        {!isCustomerDashboard && user ? (
          <div className="hidden md:flex items-center gap-4">
            <span className="hidden md:inline text-sm">Hi, {user.name}</span>
            <button
              onClick={() =>{
                onLogout();
                showCustomToast("👋 You have logged out successfully.");
              }
              }
              className="px-4 py-2 text-sm md:px-6 md:py-2.5 md:text-base rounded-full ml-4 transition-all duration-500 text-white bg-black hover:bg-[#23a8d8] hover:text-black hover:shadow-lg hover:scale-105 cursor-pointer"
            >
              Logout
            </button>
          </div>
        ) : !isCustomerDashboard && !user ? (
          <button
            type="button"
            onClick={() => setShowAuth(true)}
            className="hidden md:inline px-4 py-2 text-sm md:px-6 md:py-2.5 md:text-base rounded-full ml-2 md:ml-4 transition-all duration-500 text-white bg-black cursor-pointer hover:bg-[#23a8d8] hover:text-black hover:shadow-lg hover:scale-105"
          >
            Login
          </button>
        ) : null}

        {/* Agar customer dashboard hai to sirf Messages icon dikhana */}
        {isCustomerDashboard && user && (
          <div className="hidden md:flex items-center gap-4">
            <button onClick={() => navigate("/messages")} className="relative">
              <FiBell className="text-xl cursor-pointer hover:text-[#28a6bf]" />
               {unreadCount > 0 && (
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
        {unreadCount}
      </span>
    )}
            </button>
          </div>
        )}

        {/* Mobile Section */}
        <div className="flex items-center gap-3 md:hidden">
          {!isCustomerDashboard && !user && (
            <button
              onClick={() => setShowAuth(true)}
              className="md:hidden px-3 py-1.5 text-xs rounded-full bg-black text-white hover:bg-[#23a8d8] hover:text-black hover:shadow-lg hover:scale-105"
            >
              Login
            </button>
          )}
          {!isCustomerDashboard && user && (
            <button
              onClick={onLogout}
              className="px-3 py-1.5 text-xs rounded-full bg-black text-white hover:text-black hover:shadow-lg hover:scale-105"
            >
              Logout
            </button>
          )}
          {isCustomerDashboard && user && (
            <button onClick={() => navigate("/messages")} className="relative">
              <FiBell className="text-xl cursor-pointer hover:text-[#28a6bf]" />
               {unreadCount > 0 && (
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
        {unreadCount}
      </span>
    )}
            </button>
          )}

          <img
            onClick={() => {
              setIsMenuOpen(!isMenuOpen)
              console.log("Menu toggled!");
            }
            }
            
            src={assets.menuIcon}
            alt="menu"
            className={`${isScrolled && "invert"} h-5 w-5 cursor-pointer`}
          />
        </div>
 {/* Mobile Menu */}
                <div className={`fixed top-0 left-0 w-full h-screen bg-white text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 transition-all duration-500 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
                    <button className="absolute top-4 right-4" onClick={() => setIsMenuOpen(false)}>
                        <img src={assets.closeIcon} alt="close-menu" className="h-6.5" />
                    </button>

                    {/* {navLinks.map((link, i) => (
                        <a key={i} href={link.path} onClick={() => setIsMenuOpen(false)}>
                            {link.name}
                        </a>
                    ))} */}
                    {navLinks.map((link, i) =>
  isHome ? (
    <ScrollLink
      key={i}
      to={link.to}
      smooth={true}
      duration={500}
      spy={true}
      offset={-70}
      onClick={() => setIsMenuOpen(false)}
      className="cursor-pointer hover:text-[#267686]"
    >
      {link.name}
    </ScrollLink>
  ) : (
    <span
      key={i}
      onClick={() => {
        navigate(`/?scroll=${link.to}`);
        setIsMenuOpen(false);
      }}
      className="cursor-pointer hover:text-[#267686]"
    >
      {link.name}
    </span>
  )
)}



                   {user && <button className="border px-4 py-1 text-sm font-light rounded-full cursor-pointer transition-all" onClick={()=>{ if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/my-bookings");
      }
      setIsMenuOpen(false); // ✅ menu band bhi ho jaye
    }}>
                       Dashboard
                    </button>
}
                   {!user &&  <button onClick={setShowAuth} className="bg-black text-white px-8 py-2.5 rounded-full transition-all duration-500">
                        Login
                    </button>}
                </div>
      </nav>
      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="relative bg-transparent rounded-2xl shadow-lg">
            <button
              onClick={() => setShowAuth(false)}
              className="absolute top-5 right-5 text-gray-900 hover:text-red-500 transition"
            >
              <img src={assets.closeIcon} alt="" />
            </button>
            <AuthForm 
            onLogin={(loggedInUser) => { 
          onLogin(loggedInUser);   // ✅ direct App.jsx ka setUser chalega
          setShowAuth(false);      // ✅ modal band ho jayega
          showCustomToast(`✅ Welcome back, ${loggedInUser.name}!`);
        }} 
             />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;









