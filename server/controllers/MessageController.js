import Message from "../models/Message.js";
import mongoose from "mongoose";
import { getIO } from "../socket.js";

// ✅ Customer conversation ke liye
export const getMyConversation = async (req, res) => {
  try {
    console.log("getMyConversation req.user:", req.user?.id); // 👀 yaha check karo
    const userId = req.user.id;
    const messages = await Message.find({
      $or: [
        { userId: userId, sender: "user" },
        { userId: userId, sender: "admin" },
      ],
    }).sort({ createdAt: 1 });
    await Message.updateMany(
      { userId, sender: "admin", read: false },
      { $set: { read: true } }
    );
    res.json({ messages });
  } catch (err) {
    console.error("getMyConversation error:", err);
    res.status(500).json({ message: "Server error" });
  }
};




// ✅ GET conversation (all messages with one user)
export const getConversation = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const messages = await Message.find({ userId }).sort({ createdAt: 1 });

     // 👇 unread msgs ko read mark karo
    await Message.updateMany(
      { userId, sender: "user", read: false },
      { $set: { read: true } }
    );
    res.json({ messages });
  } catch (err) {
    console.error("getConversation error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Customer sends message
export const sendFromUser = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Text is required" });
    }

    const msg = await Message.create({
      userId: req.user.id, // from token
      sender: "user",
      text: text.trim(),
      read:false,
    });

    // 🔥 Emit message to admin (for real-time)
    const io = getIO();
    io.to(`user_admin`).emit("newMessage", msg); // all admins join "user_admin" room

    res.status(201).json({ message: msg });
  } catch (err) {
    console.error("sendFromUser error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Admin replies
export const sendFromAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    const { text } = req.body;

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Text is required" });
    }

    const msg = await Message.create({
      userId,
      sender: "admin",
      text: text.trim(),
      read:false,
    });

    // 🔥 Emit message to that user
    const io = getIO();
    io.to(`user_${userId}`).emit("newMessage", msg);

    res.status(201).json({ message: msg });
  } catch (err) {
    console.error("sendFromAdmin error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get all users who have messaged (for Admin Message List)
export const getUsersWithMessages = async (req, res) => {
  try {
    const users = await Message.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$userId",
          lastMessage: { $first: "$text" },
          lastDate: { $first: "$createdAt" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      { $unwind: "$userInfo" },
     
      // 👇 unreadCount calculate karo
      {
        $lookup: {
          from: "messages",
          let: { uId: "$_id" },
          pipeline: [
            { $match: {
                $expr: {
                  $and: [
                    { $eq: ["$userId", "$$uId"] },
                    { $eq: ["$sender", "user"] },
                    { $eq: ["$read", false] }
                  ]
                }
              }
            },
            { $count: "count" }
          ],
          as: "unreadDocs"
        }
      },

      {
        $addFields: {
          unreadCount: { $ifNull: [{ $arrayElemAt: ["$unreadDocs.count", 0] }, 0] }
        }
      },

      {
        $project: {
          _id: 1,
          name: "$userInfo.name",
          email: "$userInfo.email",
          lastMessage: 1,
          lastDate: 1,
          unreadCount: 1   
        },
      },
      { $sort: { lastDate: -1 } },
    ]);

    res.json({ users });
  } catch (err) {
    console.error("getUsersWithMessages error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// controllers/MessageController.js

export const getUnreadAdminCount = async (req, res) => {
  try {
    const userId = req.user._id; // customer ka id from auth

    const count = await Message.countDocuments({
      userId,
      sender: "admin",
      read: false
    });

    res.json({ unreadCount: count });
  } catch (err) {
    console.error("getUnreadAdminCount error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


