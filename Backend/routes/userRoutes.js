const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  getUserProfile,
  updateProfile,
  followUser,
} = require("../controllers/userController");

// IMPORTANT: Static routes must be declared BEFORE dynamic /:param routes
// to prevent route shadowing

// Update profile (authenticated) - must come before /:username
router.put("/update", auth, updateProfile);

// Get public user profile by username - dynamic route last
router.get("/:username", getUserProfile);

// Follow / Unfollow (authenticated)
router.post("/:username/follow", auth, followUser);

module.exports = router;