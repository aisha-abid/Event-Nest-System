import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: "usd" },
  status: { type: String, enum: ["Pending", "Success", "Failed","Refunded"], default: "Pending" },
  stripePaymentId: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Payment = mongoose.models.Payment || mongoose.model("Payment", paymentSchema);

export default Payment;
