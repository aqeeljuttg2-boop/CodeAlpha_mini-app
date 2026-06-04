const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  register,
  login,
  getMe,
  logout
} = require("../controllers/authController");

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/me", auth, getMe);
router.post("/logout", auth, logout);

module.exports = router;