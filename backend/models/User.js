// src/models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String }, // e.g., 'Software Engineer'
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "employee"], default: "employee" },
  profilePic: { type: String },
  department: { type: String },
  phone: { type: String },
  isDeleted: { type: Boolean, default: false },
  assignedTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
