import { Server } from "socket.io";
import jwt from "jsonwebtoken";

let io;

export function init(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "https://event-nest-system.onrender.com",
      methods: ["GET", "POST"]
    }
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token) return next(new Error("Authentication error: No token"));

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = payload;
      return next();
    } catch (err) {
      return next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.user.id || socket.user._id;
    console.log("Socket connected for user:", userId, "socketId:", socket.id);
    socket.join(`user_${userId}`);
    socket.join(`user_admin`); // Admin 

    socket.on("sendMessage", (msg) => {
      // Handle sendMessage event
      io.to(`user_${msg.userId}`).emit("newMessage", msg); // Emit to specific user
      io.to(`user_admin`).emit("newMessage", msg); // Emit to admin
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", userId, socket.id);
    });
  });

  return io;
}

export function getIO() {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
}
