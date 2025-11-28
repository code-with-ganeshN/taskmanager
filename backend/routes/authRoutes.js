const express = require("express");
const { login, register } = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const router = express.Router();

// public: login
router.post("/login", login);

// register: admin-only route to create users
router.post("/register", authMiddleware, roleMiddleware("admin"), register);

module.exports = router;
