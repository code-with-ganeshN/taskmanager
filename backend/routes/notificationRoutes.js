const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  clearAll,
} = require("../controllers/notificationController");

router.use(auth);

router.get("/", getNotifications);
router.put("/:id/read", markAsRead);
router.put("/read-all", markAllAsRead);
router.delete("/clear", clearAll);

module.exports = router;
