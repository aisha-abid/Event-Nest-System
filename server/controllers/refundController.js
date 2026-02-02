import Booking from "../models/Booking.js";
import Payment from "../models/payment.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const refundPayment = async (req, res) => {
  try {
     console.log("👉 Refund API hit ✅");
    console.log("Request body:", req.body);
      console.log("Headers:", req.headers);
    const { bookingId } = req.body;
    if (!bookingId){
    console.log("❌ Booking ID missing");
    return res.status(400).json({ message: "Booking ID is required" });
    }

    // 1️⃣ Find payment by booking ID
    const payment = await Payment.findOne({ bookingId });
    console.log("🔍 Payment found:", payment);

    if (!payment)
        {
        console.log("❌ Payment not found for bookingId:", bookingId);
        return res.status(404).json({ message: "Payment not found" });
         }
    // 2️⃣ Check if already refunded
    if (payment.status === "Refunded") {
        console.log("⚠️ Payment already refunded, skipping Stripe API call");
      return res.status(400).json({ message: "Payment has already been refunded" });
    }

    // 3️⃣ Refund via Stripe
     console.log("👉 Attempting refund with Stripe payment_intent:", payment.stripePaymentId);
    const refund = await stripe.refunds.create({
      payment_intent: payment.stripePaymentId,
    });
    console.log("✅ Stripe refund response:", refund);

    // 4️⃣ Update Payment  in DB
    payment.status = "Refunded";
    await payment.save();
    console.log("💾 Payment updated in DB:", payment);


    // 4️⃣ Update booking  in DB
    const booking = await Booking.findById(bookingId);
    console.log("🔍 Booking found:", booking);
    if (booking) {
      booking.paymentStatus="Refunded";
      booking.status = "Cancelled";
      booking.refundStatus = "Refunded"; //yaha processed tha phly
      
    //   booking.refundStatus = "Processed"; // optional field
      await booking.save();
      console.log("💾 Booking updated in DB:", booking);
    }else {
      console.log("❌ No booking found with ID:", bookingId);
    }

    res.status(200).json({ message: "Refund processed successfully", refund });

  } catch (error) {
    console.error("Refund error:", error);

    // Handle Stripe refund errors separately
    if (error.type === "StripeInvalidRequestError") {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: "Refund failed", error: error.message });
  }
};











// export const refundPayment = async (req, res) => {
//   try {
//     const { paymentId } = req.body;
//     if (!paymentId) return res.status(400).json({ message: "Payment ID is required" });

//     // 1️⃣ Find payment
//     const payment = await Payment.findById(paymentId);
//     if (!payment) return res.status(404).json({ message: "Payment not found" });

//     // 2️⃣ Refund via Stripe
//     const refund = await stripe.refunds.create({
//       payment_intent: payment.stripePaymentId,
//     });

//     // 3️⃣ Update Payment and Booking in DB
//     payment.status = "Refunded";
//     await payment.save();

//     const booking = await Booking.findById(payment.bookingId);
//     if (booking) {
//       booking.paymentStatus = "Refunded";
//       booking.status = "Cancelled";
//       await booking.save();
//     }

//     res.status(200).json({ message: "Refund processed successfully", refund });

//   } catch (error) {
//     console.error("Refund error:", error);
//     res.status(500).json({ message: "Refund failed", error: error.message });
//   }
// };

// import Booking from "../models/Booking.js";
// import Payment from "../models/payment.js";
// import Stripe from "stripe";
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// export const refundPayment = async (req, res) => {
//   try {
//     const { bookingId } = req.body;
//     if (!bookingId) return res.status(400).json({ message: "Booking ID is required" });

//     // 1️⃣ Find payment by booking ID
//     const payment = await Payment.findOne({ bookingId });
//     if (!payment) return res.status(404).json({ message: "Payment not found" });

//     // 2️⃣ Refund via Stripe
//     const refund = await stripe.refunds.create({
//       payment_intent: payment.stripePaymentId,
//     });

//     // 3️⃣ Update Payment and Booking in DB
//     payment.status = "Refunded";
//     await payment.save();

//     const booking = await Booking.findById(bookingId);
//     if (booking) {
//       booking.paymentStatus = "Refunded";
//       booking.status = "Cancelled";
//       booking.refundStatus = "Processed"; // optional field
//       await booking.save();
//     }

//     res.status(200).json({ message: "Refund processed successfully", refund });

//   } catch (error) {
//     console.error("Refund error:", error);
//     res.status(500).json({ message: "Refund failed", error: error.message });
//   }
// };




