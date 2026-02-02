import Booking from "../models/Booking.js";

// 📌 Get All Bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "name email") // user basic info
      .sort({ createdAt: -1 });

    res.status(200).json({ bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Error fetching bookings" });
  }
};


// ✅ get booking details by id
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id)
    .populate("userId", "name email")           // user info
      .populate("selectedDishes.food");           // dish info bhi le aao


    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ success: true, booking });
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// PUT: /api/v1/admin/booking/:id/cancel-request
export const handleCancelRequest = async (req, res) => {
  try {
     console.log("Cancel request received for ID:", req.params.id);
    console.log("Action:", req.body.action);
    const { id } = req.params;
    const { action } = req.body; // "Accepted" or "Rejected"

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.cancelRequest = action; 
    await booking.save();

    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({
      message: "Error updating cancel request",
      error: err.message,
    });
  }
};


// 📌 Get Cancel Requests (only those where cancelRequest = "Pending")
export const getCancelRequests = async (req, res) => {
  try {
    const requests = await Booking.find({ cancelRequest: "Pending" })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ requests });
  } catch (error) {
    res.status(500).json({ message: "Error fetching cancel requests", error: error.message });
  }
};

//Dashboard stats in which we show total and cancel bookings
export const getDashboardStats = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments(); 
    const cancelRequests = await Booking.countDocuments({ cancelRequest: "Pending" });

     const recentBookings = await Booking.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      totalBookings,
      cancelRequests,
      recentBookings
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching dashboard stats", error: error.message });
  }
};