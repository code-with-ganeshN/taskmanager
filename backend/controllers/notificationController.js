// src/controllers/notificationController.js
const Notification = require("../models/Notification");

// Get notifications for logged-in user (unread first)
const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    // find notifications where this user is included
    const notifs = await Notification.find({ users: userId }).sort({ createdAt: -1 }).limit(100);
    // mark unread flag for client (isRead = whether user in isReadBy)
    const mapped = notifs.map(n => ({
      id: n._id,
      message: n.message,
      type: n.type,
      relatedTask: n.relatedTask,
      actionLink: n.actionLink,
      createdAt: n.createdAt,
      isRead: n.isReadBy.map(String).includes(String(userId)),
    }));
    res.json({ data: mapped });
  } catch (err) {
    console.error("Get notifications error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Mark single notification as read for the current user
const markAsRead = async (req, res) => {
  try {
    const userId = req.user._id;
    const id = req.params.id;
    const notif = await Notification.findById(id);
    if (!notif) return res.status(404).json({ message: "Notification not found" });

    if (!notif.isReadBy.map(String).includes(String(userId))) {
      notif.isReadBy.push(userId);
      await notif.save();
    }
    res.json({ message: "Notification marked as read" });
  } catch (err) {
    console.error("Mark notif read error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Mark all unread notifications as read for current user
const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user._id;
    // add userId to isReadBy of all notifications where they are recipient and not yet read
    await Notification.updateMany({ users: userId, isReadBy: { $ne: userId } }, { $push: { isReadBy: userId } });
    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    console.error("Mark all read error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Clear notifications for user (remove user from users array - optional)
const clearAll = async (req, res) => {
  try {
    const userId = req.user._id;
    // remove notifications where users = userId (soft clear for that user)
    await Notification.updateMany({ users: userId }, { $pull: { users: userId }, $pullAll: { isReadBy: [userId] } });
    res.json({ message: "Notifications cleared for user" });
  } catch (err) {
    console.error("Clear notifications error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getNotifications, markAsRead, markAllAsRead, clearAll };
