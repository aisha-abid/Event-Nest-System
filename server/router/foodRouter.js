// routes/foodRoutes.js
import express from "express";
import { getAllFoods, getFoodsByCategory,} from "../controllers/foodController.js";


const router = express.Router();

router.get("/", getAllFoods); // GET /api/foods
router.get("/category/:cat", getFoodsByCategory); // GET /api/foods/category/starters


export default router;
