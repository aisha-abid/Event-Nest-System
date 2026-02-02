import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // logged-in user
  name: { type: String, required: true },
  phone: { type: String, required: true },
  eventType: { type: String, required: true },
  guests: { type: Number, required: true },
  foodPackage: {
  type: String,
  required: true,
},


  selectedDishes: [
    {
      food: { type: mongoose.Schema.Types.ObjectId, ref: "Food", required: true },
      category: String,
      quantity: { type: Number, default: 1 }, // optional if you allow per-dish qty
    },
  ],

  decoration: { type: String },
  date: { type: String, required: true },
  time: { type: String, required: true },
  pricePerGuest: { type: Number, default: 0 },
  decorationCost: { type: Number, default: 0 },
  totalPrice: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  paymentStatus: {type: String,enum: ["Pending", "Success", "Failed", "Cancelled", "Refunded"],default: "Pending",},
  status: {  type: String, enum: ["Pending", "Confirmed", "Cancelled"], default: "Pending",  },
  cancelRequest: { type: String, enum: ["None", "Pending", "Accepted", "Rejected"], default: "None", },
  paidAt: { type: Date },
   // 🔹 Stripe Payment tracking for refund
  stripePaymentId: { type: String },          // Stripe PaymentIntent ID
  refundStatus: { type: String, enum: ["None", "Requested", "Refunded"], default: "None" }, 
});
export default mongoose.model("Booking", bookingSchema);
