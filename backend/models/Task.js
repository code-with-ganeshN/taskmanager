// src/models/Task.js
const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  text: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

const HistorySchema = new mongoose.Schema({
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String },
  comment: { type: String },
  updatedAt: { type: Date, default: Date.now },
});

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // multiple users allowed
  team: { type: String, enum: ["single", "multiple"], default: "single" },
  status: { type: String, enum: ["pending", "in-progress", "completed"], default: "pending" },
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  category: { type: String },
  tags: [{ type: String }],
  assignedTime: { type: Date, default: Date.now },
  deadline: { type: Date },
  reminderTime: { type: Date },
  isDeleted: { type: Boolean, default: false },
  comments: [CommentSchema],
  history: [HistorySchema],
}, { timestamps: true });

module.exports = mongoose.model("Task", TaskSchema);
