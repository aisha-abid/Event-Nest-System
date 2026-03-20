import express from "express";
import dotenv from "dotenv";
dotenv.config({ path: "./config/config.env" });
import authRouter from "./router/authRouter.js";
import BookingRouter from "./router/BookingRouter.js";
import CustomerBookingRouter from "./router/CustomerBookingRouter.js"
import eventRouter from "./router/eventRouter.js";
import paymentRouter from "./router/paymentRouter.js";
import refundRouter from "./router/refundRouter.js";
import modificationRouter from "./router/modificationRouter.js";
import notificationRouter from "./router/notificationRouter.js";
import adminRouter from "./router/adminRouter.js";
import MessageRouter from "./router/MessageRouter.js";
import foodRouter from "./router/foodRouter.js";

import cors from 'cors';

const app = express();


app.use(cors({
  //check code ok
  origin: process.env.FRONTEND_URL || 'https://event-nest-system.vercel.app', // frontend ka URL 
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true, // agar cookies/token use kar rahe ho
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/v1/auth", authRouter);
app.use("/api/v1/bookings", BookingRouter);
app.use("/api/v1/customers", CustomerBookingRouter);
app.use("/api/v1/event", eventRouter);
app.use("/api/v1/payment", paymentRouter);
app.use("/api/v1/refund", refundRouter);
app.use("/api/v1/modification", modificationRouter);
app.use("/api/v1/notification", notificationRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/messages", MessageRouter);
app.use("/api/v1/foods", foodRouter);

export default app;
