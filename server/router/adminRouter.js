import express from "express";
import { protect, isAdmin } from "../middleware/authMiddleware.js";
import { getAllBookings, getCancelRequests,getBookingById, handleCancelRequest  } from "../controllers/adminController.js";
import { getDashboardStats } from "../controllers/adminController.js";
// import { getAllMessages } from "../controllers/MessageController.js";

const router = express.Router();

// Admin Routes
// all bookings
router.get("/all-bookings", protect, isAdmin, getAllBookings);  

// cancel requests
router.get("/cancel-req", protect, isAdmin, getCancelRequests); 

// GET single booking by ID
router.get("/booking/:id", protect,isAdmin, getBookingById);

// cancel requests actions
// router.put("/cancel-req/:id/approve", protect, isAdmin, approveCancelRequest);
// router.put("/cancel-req/:id/reject", protect, isAdmin, rejectCancelRequest);

// adminRouter.js
//Accept and reject cancel request
router.put("/booking/:id/cancel-request", protect, isAdmin, handleCancelRequest);


//Total bookings count
router.get("/dashboard-stats", getDashboardStats);


// router.get("/messages",getAllMessages)


export default router;
