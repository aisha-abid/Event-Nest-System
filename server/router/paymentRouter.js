import express from "express";
import {
  makePayment,
  confirmPayment,
  getAllPayments,
} from "../controllers/paymentController.js";
import { protect as authenticate } from "../middleware/authMiddleware.js"; // Rename during import
import {  isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Add authentication 

router.post("/pay", authenticate, makePayment);
router.post("/confirm", authenticate, confirmPayment);

 // Add isAdmin for admin routes
router.get("/admin/all", authenticate, isAdmin, getAllPayments);


// router.get("/get-payment-by-booking/:bookingId", authenticate, getPaymentByBooking);//dekhty hay k iska kya karna


export default router;