// src/controllers/employeeController.js
const User = require("../models/User");

// Get all active employees (paginated + search)
const getEmployees = async (req, res) => {
  try {
    const { page = 1, limit = 20, q } = req.query;
    const filter = { isDeleted: false };
    if (q) filter.$or = [{ name: new RegExp(q, "i") }, { email: new RegExp(q, "i") }, { department: new RegExp(q, "i") }];

    const employees = await User.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .select("-password")
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(filter);
    res.json({ data: employees, page: Number(page), total });
  } catch (err) {
    console.error("Get employees error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Get deleted employees
const getDeletedEmployees = async (req, res) => {
  try {
    const deleted = await User.find({ isDeleted: true }).select("-password").sort({ updatedAt: -1 });
    res.json({ data: deleted });
  } catch (err) {
    console.error("Get deleted employees error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Soft delete employee
const softDeleteEmployee = async (req, res) => {
  try {
    const id = req.params.id;
    if (req.user._id.equals(id)) return res.status(400).json({ message: "Admin cannot delete self" });

    const user = await User.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User soft-deleted", user: { id: user._id } });
  } catch (err) {
    console.error("Soft delete employee error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Restore employee
const restoreEmployee = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findByIdAndUpdate(id, { isDeleted: false }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User restored", user: { id: user._id } });
  } catch (err) {
    console.error("Restore employee error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Update employee details (admin)
const updateEmployee = async (req, res) => {
  try {
    const id = req.params.id;
    const update = { ...req.body };
    delete update.password; // changing password via separate endpoint
    const user = await User.findByIdAndUpdate(id, update, { new: true }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User updated", user });
  } catch (err) {
    console.error("Update employee error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getEmployees,
  getDeletedEmployees,
  softDeleteEmployee,
  restoreEmployee,
  updateEmployee,
};
