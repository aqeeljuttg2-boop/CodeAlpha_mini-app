const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  addComment,
  likeComment,
  replyToComment
} = require("../controllers/commentController");

// Add comment
router.post("/:id/comment", auth, addComment);

// Like / Unlike comment
router.put("/:id/comment_like", auth, likeComment);

// Reply to comment
router.post("/:id/comment_reply", auth, replyToComment);

module.exports = router;