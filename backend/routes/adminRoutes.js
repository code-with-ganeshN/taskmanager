const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const {
  getEmployees,
  getDeletedEmployees,
  softDeleteEmployee,
  restoreEmployee,
  updateEmployee,
} = require("../controllers/employeeController");

const {
  createTask,
  getAllTasks,
  getDeletedTasks,
  softDeleteTask,
  restoreTask,
  updateTask,
  getTaskById,
  assignTask,
} = require("../controllers/taskController");

// all routes protected & admin only
router.use(authMiddleware, roleMiddleware("admin"));

// Employee routes
router.get("/employees", getEmployees);
router.get("/employees/deleted", getDeletedEmployees);
router.put("/employees/:id/delete", softDeleteEmployee);
router.put("/employees/:id/restore", restoreEmployee);
router.put("/employees/:id", updateEmployee);

// Task routes (admin)
router.post("/tasks", createTask);
router.get("/tasks", getAllTasks);
router.get("/tasks/deleted", getDeletedTasks);
router.put("/tasks/:id/delete", softDeleteTask);
router.put("/tasks/:id/restore", restoreTask);
router.put("/tasks/:id", updateTask);
router.get("/tasks/:id", getTaskById);

// Assign task to employee
router.post("/tasks/:id/assign", assignTask);


module.exports = router;
