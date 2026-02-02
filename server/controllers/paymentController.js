import Booking from "../models/Booking.js";
import Payment from "../models/payment.js";
import Stripe from "stripe";
import dotenv from 'dotenv';
dotenv.config({ path: "./config/config.env" });

// Only backend should use the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// --------------------- Make Payment ---------------------
export const makePayment = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: "User not authenticated" });
    const userId = req.user._id; // 👈 authenticated user  ya is line mn error
    // const userId = req.user?.id || "66d6f4f2b8a4f12b0c123456"; // fake MongoDB ObjectId

    const { amount, bookingId, name } = req.body;
  //  if (!req.user) return res.status(401).json({ error: "User not authenticated" });
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    if (!bookingId) {
      return res.status(400).json({ error: "Booking ID is required" });
    }

    // 1️⃣ Create Stripe PaymentIntent  sari opn o g?
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // convert to cents
      currency: "pkr",
      payment_method_types: ["card"],
      metadata: { userId,  bookingId },
    });

    // 2️⃣ Save pending payment in MongoDB
    const payment = await Payment.create({
      userId,
      bookingId,
      name,
      amount,
      status: "Pending", // matches enum
      stripePaymentId: paymentIntent.id,
    });

    // 3️⃣ Send clientSecret to frontend
    res.status(201).json({
      message: "Payment initiated",
      clientSecret: paymentIntent.client_secret,
      paymentId: payment._id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// --------------------- Confirm Payment ---------------------
export const confirmPayment = async (req, res) => {
  try {
    const { paymentId, paymentIntentId } = req.body;

    if (!paymentId || !paymentIntentId) {
      return res.status(400).json({ error: "PaymentId and PaymentIntentId are required" });
    }

    // Retrieve status from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // Map Stripe status to schema enum
    let status;
    if (paymentIntent.status === "succeeded") status = "Success";
    else if (paymentIntent.status === "requires_payment_method") status = "Failed";
    else status = "Pending";

    // Update MongoDB record
    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      { status },
      { new: true }
    );

    // 🔹 Step 3: Update Booking if payment succeeded
    if (status === "Success" && payment) {
      const booking = await Booking.findById(payment.bookingId);
      if (booking) {
        // booking.paymentStatus !== "Success";
        booking.paymentStatus = "Success";
        booking.status = "Confirmed"; 
        await booking.save();
      }else {
      console.log("Booking already marked as paid, skipping update.");
    }
    }

    res.status(200).json({ message: "Payment confirmed", payment });

  } catch (err) {
     console.error("Payment error:", err);
    res.status(500).json({ error: err.message });
  }
};

// --------------------- Get All Payments (Admin) ---------------------
export const getAllPayments = async (req, res) => {
  try {
    // Admin check example
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ error: "Access denied" });
    }

    const payments = await Payment.find().populate("userId", "name email").populate("bookingId", "title date");
    res.status(200).json(payments);

  } catch (err) {
   
    res.status(500).json({ error: err.message });
  }
};




// export const getPaymentByBooking = async (req, res) => {
//   try {
//     const bookingId = req.params.bookingId;
//     const payment = await Payment.findOne({ bookingId });
//     if (!payment) return res.status(404).json({ message: "Payment not found" });
//     res.status(200).json(payment);
//   } catch (error) {
//     console.error("Error getting payment:", error);
//     res.status(500).json({ message: "Error getting payment" });
//   }
// };

