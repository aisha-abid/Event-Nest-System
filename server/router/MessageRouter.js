import { Router } from "express";
import { authenticate, isAdmin } from "../middleware/authMiddleware.js";
import {
  getConversation,
  sendFromUser,
  sendFromAdmin,
  getUsersWithMessages,
  getMyConversation,
  getUnreadAdminCount
} from "../controllers/MessageController.js";

const router = Router();

// Customer
router.get("/", authenticate, getMyConversation);  //apni chat
router.post("/", authenticate, sendFromUser);      // message bhejna
router.get("/unread-count", authenticate, getUnreadAdminCount);



// Admin
router.get("/users", authenticate, isAdmin, getUsersWithMessages); // customers list
router.get("/:userId", authenticate, isAdmin, getConversation);    // ek user ki chat
router.post("/:userId/reply", authenticate, isAdmin, sendFromAdmin); // reply bhejna



export default router;
