import Navbar from "./components/Navbar"
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Layout from "./pages/Admin/Layout";
import Dashboard from "./pages/Admin/Dashboard";
import AllBookings from "./pages/Admin/AllBookings";
import BookingDetails from "./pages/Admin/BookingDetails";
import CancelRequests from "./pages/Admin/CancelRequests";
import BookingPage from "./pages/BookingPage";
import SummaryBooking from "./pages/SummaryBooking";
import PaymentPage from "./pages/PaymentPage";
import CustomerDashboard from "./pages/CustomerDashboard";
import UpdateBooking from "./pages/UpdateBooking";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import CustomerMessages from "./pages/CustomerMessages";
import AdminChatPage from "./pages/Admin/AdminChatPage";
import AdminMessageList from "./pages/Admin/AdminMessageList";
import ExploreMenu from "./pages/ExploreMenu";


const App = () => {
  const [user, setUser] = useState(null);
  const location = useLocation();

  // Jab component mount ho ya localStorage change ho, user ko reload karo
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  // Add new code
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null); // ✅ state clear -> UI update without refresh
  };


  const isAdminPath = location.pathname.includes("/admin"); 
  return (
    <div>
      {!isAdminPath &&<Navbar user={user} onLogout={handleLogout} onLogin={setUser}/>}
      {/* {false && <HotelReg/>} */}
         
         <Toaster
  position="bottom-left"
  toastOptions={{
    duration: Infinity,
    style: {
      background: "#fff",
      color: "#333",
      border: "1px solid #e5e5e5",
      boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
      borderRadius: "8px",
      padding:"2px",
      minWidth: "250px"
    },
  }}
/>
      
      <div className="min-h-[70vh]">
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/booking" element={<BookingPage/>}/>
          <Route path="/summary-booking" element={<SummaryBooking/>}/>
          <Route path="/payment" element={<PaymentPage/>}/>
          <Route path="/my-bookings" element={<CustomerDashboard user={user}/>}/>
          <Route path="/update-bookings/:id" element={<UpdateBooking/>}/>
          <Route path="/messages" element={<CustomerMessages />}/>
          <Route path="/menu" element={<ExploreMenu/>}/>
          
          
          


          <Route path="/admin" element={<Layout/>}>
          <Route index element={<Dashboard/>}/>
          <Route path="all-bookings" element={<AllBookings/>}/>
          <Route path="/admin/booking/:id" element={<BookingDetails/>} />
          <Route path="cancel-req" element={<CancelRequests/>}/>
          <Route path="messages" element={<AdminMessageList />}/>
          <Route path="messages/:id" element={<AdminChatPage />}/>
          <Route path="customerMsg" element={<CustomerMessages />}/>
          
          
          
          
          
          </Route>
        </Routes>
      </div>
     { location.pathname=== "/" && <Footer/>}
    </div>
  )
}

export default App