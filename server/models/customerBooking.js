import mongoose from "mongoose";
const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  guests: Number,
  date: Date,
  status: { type: String, enum: ["Pending", "Confirmed", "Failed"], default: "Pending" },
  paymentStatus: { type: String, enum: ["Pending", "Success", "Failed"], default: "Pending" }, // ✅ add this
  cancelRequest: {  type: String,  enum: ["None", "Pending", "Approved", "Rejected"],  default: "None"}

});

export default mongoose.model("Booking", bookingSchema);