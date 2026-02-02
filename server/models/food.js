import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ["starters", "salads", "mainCourse", "drinks", "beverages","desserts", ], required: true },
  price: { type: Number, required: true },
});

export default mongoose.model("Food", foodSchema);
