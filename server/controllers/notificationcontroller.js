import Notification from "../models/notification.js";

export const sendNotification = async (req, res) => {
  try {
    const notification = await Notification.create(req.body);
    res.status(201).json({ message: "Notification sent", notification });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const createNotification = async (req, res) => {
  try {
    // Your logic to create a notification
    res.status(201).json({ message: "Notification created" });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

export const getNotifications = async (req, res) => {
  try {
    // Your logic to get notifications
    res.status(200).json({ message: "List of notifications" });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};