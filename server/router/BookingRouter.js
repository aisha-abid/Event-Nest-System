import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createBooking, getMyBookings, checkAvailability,  } from "../controllers/BookingController.js";

const router = express.Router();

router.post("/create", protect, createBooking);
router.get("/my-bookings", protect, getMyBookings);
router.post("/check-availability", protect, checkAvailability);



export default router;
