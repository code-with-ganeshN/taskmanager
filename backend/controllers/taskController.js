// src/controllers/taskController.js
const Task = require("../models/Task");
const User = require("../models/User");
const { createNotification } = require("../utils/sendNotification");

// Create a task (admin)
const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      assignedTo = [],
      team = assignedTo.length > 1 ? "multiple" : "single",
      status,
      priority,
      category,
      tags,
      deadline,
      reminderTime,
    } = req.body;

    const assignedIds = Array.isArray(assignedTo) ? assignedTo : (assignedTo ? [assignedTo] : []);

    const task = new Task({
      title,
      description,
      assignedTo: assignedIds,
      team,
      status,
      priority,
      category,
      tags,
      assignedTime: new Date(),
      deadline,
      reminderTime,
    });

    await task.save();

    // update users assignedTasks array
    if (assignedIds.length) {
      await User.updateMany(
        { _id: { $in: assignedIds } },
        { $addToSet: { assignedTasks: task._id } }
      );
      // create notification for assigned users
      const message = `New task "${task.title}" assigned to you.`;
      await createNotification({ userIds: assignedIds, message, type: "task_assigned", relatedTask: task._id, actionLink: `/tasks/${task._id}` });
    }

    res.status(201).json({ message: "Task created", task });
  } catch (err) {
    console.error("Create task error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all tasks (admin) - exclude deleted by default
const getAllTasks = async (req, res) => {
  try {
    const { page = 1, limit = 50, includeDeleted = "false", status, assignedTo } = req.query;
    const filter = {};
    if (includeDeleted !== "true") filter.isDeleted = false;
    if (status) filter.status = status;
    if (assignedTo) filter.assignedTo = assignedTo;

    const tasks = await Task.find(filter)
      .populate("assignedTo", "name email title")
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Task.countDocuments(filter);
    res.json({ data: tasks, page: Number(page), total });
  } catch (err) {
    console.error("Get all tasks error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Get deleted tasks
const getDeletedTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ isDeleted: true }).populate("assignedTo", "name email");
    res.json({ data: tasks });
  } catch (err) {
    console.error("Get deleted tasks error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Soft delete task
const softDeleteTask = async (req, res) => {
  try {
    const id = req.params.id;
    const task = await Task.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!task) return res.status(404).json({ message: "Task not found" });

    // remove task ref from users' assignedTasks (optional: keep or remove; here we'll remove)
    if (task.assignedTo && task.assignedTo.length) {
      await User.updateMany({ _id: { $in: task.assignedTo } }, { $pull: { assignedTasks: task._id } });
      // notify assigned users
      const message = `Task "${task.title}" was deleted (moved to recycle bin).`;
      await createNotification({ userIds: task.assignedTo, message, type: "task_deleted", relatedTask: task._id, actionLink: `/tasks/${task._id}` });
    }

    res.json({ message: "Task soft-deleted", task });
  } catch (err) {
    console.error("Soft delete task error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Restore task
const restoreTask = async (req, res) => {
  try {
    const id = req.params.id;
    const task = await Task.findByIdAndUpdate(id, { isDeleted: false }, { new: true });
    if (!task) return res.status(404).json({ message: "Task not found" });

    // re-add assignedTasks to users
    if (task.assignedTo && task.assignedTo.length) {
      await User.updateMany({ _id: { $in: task.assignedTo } }, { $addToSet: { assignedTasks: task._id } });
      const message = `Task "${task.title}" was restored.`;
      await createNotification({ userIds: task.assignedTo, message, type: "task_restored", relatedTask: task._id, actionLink: `/tasks/${task._id}` });
    }

    res.json({ message: "Task restored", task });
  } catch (err) {
    console.error("Restore task error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Update task (admin) - also manage assignment changes, history
const updateTask = async (req, res) => {
  try {
    const id = req.params.id;
    const updates = { ...req.body };

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // track assignment changes
    const prevAssigned = task.assignedTo.map(String);
    const newAssigned = updates.assignedTo ? (Array.isArray(updates.assignedTo) ? updates.assignedTo.map(String) : [String(updates.assignedTo)]) : prevAssigned;

    // update fields
    Object.assign(task, updates);

    // push history entry for update
    task.history = task.history || [];
    task.history.push({
      updatedBy: req.user._id,
      status: updates.status || task.status,
      comment: updates.comment || `Task updated by ${req.user.name}`,
      updatedAt: new Date(),
    });

    await task.save();

    // If assignments changed, sync users assignedTasks array and notify new assignees
    const added = newAssigned.filter(x => !prevAssigned.includes(x));
    const removed = prevAssigned.filter(x => !newAssigned.includes(x));

    if (added.length) {
      await User.updateMany({ _id: { $in: added } }, { $addToSet: { assignedTasks: task._id } });
      const message = `You were assigned to task "${task.title}".`;
      await createNotification({ userIds: added, message, type: "task_assigned", relatedTask: task._id, actionLink: `/tasks/${task._id}` });
    }
    if (removed.length) {
      await User.updateMany({ _id: { $in: removed } }, { $pull: { assignedTasks: task._id } });
      const message = `You were unassigned from task "${task.title}".`;
      await createNotification({ userIds: removed, message, type: "task_unassigned", relatedTask: task._id, actionLink: `/tasks/${task._id}` });
    }

    res.json({ message: "Task updated", task });
  } catch (err) {
    console.error("Update task error:", err.stack || err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a single task
const getTaskById = async (req, res) => {
  try {
    const id = req.params.id;
    const task = await Task.findById(id).populate("assignedTo", "name email title");
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ task });
  } catch (err) {
    console.error("Get task by id error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Employee adds comment or updates status (employee route)
const addComment = async (req, res) => {
  try {
    const id = req.params.id;
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Comment text required" });

    const task = await Task.findById(id);
    if (!task || task.isDeleted) return res.status(404).json({ message: "Task not found" });

    task.comments.push({ text, createdBy: req.user._id });
    task.history.push({ updatedBy: req.user._id, comment: text, updatedAt: new Date() });
    await task.save();

    // notify admins that employee commented (fetch all admins)
    const admins = await User.find({ role: "admin", isDeleted: false }).select("_id");
    const adminIds = admins.map(a => a._id);
    const message = `${req.user.name} commented on task "${task.title}".`;
    await createNotification({ userIds: adminIds, message, type: "task_commented", relatedTask: task._id, actionLink: `/tasks/${task._id}` });

    res.json({ message: "Comment added", task });
  } catch (err) {
    console.error("Add comment error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Employee updates status (own tasks)
const updateStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: "Status required" });

    const task = await Task.findById(id);
    if (!task || task.isDeleted) return res.status(404).json({ message: "Task not found" });

    // check that user is assigned to this task
    const isAssigned = task.assignedTo.map(String).includes(String(req.user._id));
    if (!isAssigned && req.user.role !== "admin") return res.status(403).json({ message: "You are not assigned to this task" });

    const oldStatus = task.status;
    task.status = status;
    task.history.push({ updatedBy: req.user._id, status, comment: `${req.user.name} changed status from ${oldStatus} to ${status}`, updatedAt: new Date() });
    await task.save();

    // notify admins
    const admins = await User.find({ role: "admin", isDeleted: false }).select("_id");
    const adminIds = admins.map(a => a._id);
    const message = `${req.user.name} changed status of "${task.title}" from ${oldStatus} to ${status}.`;
    await createNotification({ userIds: adminIds, message, type: "status_update", relatedTask: task._id, actionLink: `/tasks/${task._id}` });

    res.json({ message: "Status updated", task });
  } catch (err) {
    console.error("Update status error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};


// Assign a task to one or more employees (admin only)
const assignTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const { assignedTo } = req.body; // array of employee IDs

    if (!assignedTo || !Array.isArray(assignedTo) || assignedTo.length === 0) {
      return res.status(400).json({ message: "assignedTo must be a non-empty array of employee IDs" });
    }

    const task = await Task.findById(taskId);
    if (!task || task.isDeleted) return res.status(404).json({ message: "Task not found" });

    const prevAssigned = task.assignedTo.map(String);
    const newAssigned = assignedTo.map(String);

    // Update assignedTo field
    task.assignedTo = newAssigned;
    await task.save();

    // Sync User.assignedTasks
    const added = newAssigned.filter(id => !prevAssigned.includes(id));
    const removed = prevAssigned.filter(id => !newAssigned.includes(id));

    if (added.length) {
      await User.updateMany({ _id: { $in: added } }, { $addToSet: { assignedTasks: task._id } });
      const message = `You have been assigned to task "${task.title}".`;
      await createNotification({ userIds: added, message, type: "task_assigned", relatedTask: task._id, actionLink: `/tasks/${task._id}` });
    }

    if (removed.length) {
      await User.updateMany({ _id: { $in: removed } }, { $pull: { assignedTasks: task._id } });
      const message = `You have been unassigned from task "${task.title}".`;
      await createNotification({ userIds: removed, message, type: "task_unassigned", relatedTask: task._id, actionLink: `/tasks/${task._id}` });
    }

    const updatedTask = await Task.findById(taskId).populate("assignedTo", "name email title");
    res.json({ message: "Task assignments updated", task: updatedTask });

  } catch (err) {
    console.error("Assign task error:", err.stack || err.message);
    res.status(500).json({ message: "Server error" });
  }
};




module.exports = {
  createTask,
  getAllTasks,
  getDeletedTasks,
  softDeleteTask,
  restoreTask,
  updateTask,
  getTaskById,
  addComment,
  updateStatus,
  assignTask
};
