const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const {
  getAllTasks,
  getTaskById,
  addComment,
  updateStatus,
} = require("../controllers/taskController");

// Public for authenticated users: list tasks (admin can pass filters), but employees will likely use /user/tasks
router.use(auth);

// Admin can use adminRoutes for full management; here we allow read for auth users too
router.get("/", getAllTasks);
router.get("/:id", getTaskById);

// Employee actions on tasks (comments / status)
router.post("/:id/comment", addComment); // authenticated users can comment
router.put("/:id/status", updateStatus); // employee or admin can update if assigned or admin

module.exports = router;
