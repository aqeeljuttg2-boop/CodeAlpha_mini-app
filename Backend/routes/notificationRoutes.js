const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  getNotifications,
  markAsRead
} = require("../controllers/notificationController");

// Get all notifications (authenticated)
router.get("/", auth, getNotifications);

// Mark all as read (authenticated)
router.put("/read", auth, markAsRead);

module.exports = router;