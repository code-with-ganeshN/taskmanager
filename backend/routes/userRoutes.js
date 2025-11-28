const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const Task = require("../models/Task");
const User = require("../models/User");

// Protected routes for employee self-operations
router.use(auth);

// Get my profile
router.get("/profile", async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json({ user });
  } catch (err) {
    console.error("Get profile error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Update my profile
router.put("/profile", async (req, res) => {
  try {
    const updates = { ...req.body };
    delete updates.password; // password change via separate endpoint
    const updated = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select("-password");
    res.json({ message: "Profile updated", user: updated });
  } catch (err) {
    console.error("Update profile error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Get tasks assigned to logged-in user
router.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id, isDeleted: false }).sort({ createdAt: -1 });
    res.json({ data: tasks });
  } catch (err) {
    console.error("Get my tasks error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
