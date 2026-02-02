// controllers/foodController.js
import Food from "../models/food.js"

export const getAllFoods = async (req, res) => {
  try {
    const foods = await Food.find().sort({ category: 1, name: 1 });
    res.json({ success: true, foods });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getFoodsByCategory = async (req, res) => {
  try {
    const cat = req.params.cat;
    const foods = await Food.find({ category: cat }).sort({ name: 1 });
    res.json({ success: true, foods });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createFood = async (req, res) => {
  try {
    const food = new Food(req.body);
    await food.save();
    res.status(201).json({ success: true, food });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

