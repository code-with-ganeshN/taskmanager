// src/models/Notification.js
const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }], // recipients
  message: { type: String, required: true },
  type: { type: String }, // e.g., 'task_assigned', 'status_update', 'task_restored'
  isReadBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // track per-user read
  relatedTask: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
  actionLink: { type: String }, // frontend route to navigate
}, { timestamps: true });

module.exports = mongoose.model("Notification", NotificationSchema);
