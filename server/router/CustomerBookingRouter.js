import express from "express";
import {
  getUserBookings,
  updateBooking,
  deleteBooking,
  getSingleBooking
} from "../controllers/customerBookingController.js";

import { authenticate } from "../middleware/authMiddleware.js";
import Booking from "../models/Booking.js";

const router = express.Router();

// 1️⃣ Get all confirmed bookings for a user
router.get("/my-bookings", authenticate, getUserBookings);

// Get single booking
router.get("/:bookingId", authenticate, getSingleBooking);


// 2️⃣ Update a booking (only confirmed bookings can be updated)
router.put("/update/:bookingId",authenticate, updateBooking);

// 3️⃣ Cancel/Delete a booking (only confirmed bookings can be canceled)
router.delete("/delete/:bookingId",authenticate, deleteBooking);

router.patch("/:id/cancel", authenticate, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.cancelRequest = "Pending";
    await booking.save();

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
