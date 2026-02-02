// backend/seeder.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Food from "../models/food.js";
import foodData from "../data/seedFood.js";

dotenv.config({ path: "config/config.env" });

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Food.deleteMany(); // pehle purana data clear karo

    let foods = [];
    for (const [category, items] of Object.entries(foodData)) {
      const catFoods = items.map(item => ({ ...item, category }));
      foods = [...foods, ...catFoods];
    }

    await Food.insertMany(foods);
    console.log("Food data imported successfully!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

importData();
