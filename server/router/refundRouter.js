import express from "express";
import { refundPayment } from "../controllers/refundController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST route to refund a payment
router.post("/", authenticate, refundPayment);
//  console.log("👉 Refund request received:", req.body); 

export default router;
