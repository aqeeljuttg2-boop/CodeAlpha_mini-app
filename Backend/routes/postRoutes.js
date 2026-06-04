const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  createPost,
  getAllPosts,
  getPostById,
  likePost,
  bookmarkPost
} = require("../controllers/postController");

// Get all posts (feed) - auth required for isLiked/isBookmarked per user
router.get("/", auth, getAllPosts);

// Create new post (authenticated)
router.post("/", auth, createPost);

// Get single post - auth required for isLiked/isBookmarked
router.get("/:id", auth, getPostById);

// Like / Unlike post (authenticated)
router.put("/:id/like", auth, likePost);

// Bookmark / Unbookmark (authenticated)
router.put("/:id/bookmark", auth, bookmarkPost);

module.exports = router;