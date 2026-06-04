const Post = require("../models/Post");
const User = require("../models/User");
const Notification = require("../models/Notification");
const { formatPost } = require("../utils/formatHelper");

// Helper: fully populate a post and return formatted shape
const populateAndFormat = async (postId, currentUserId) => {
  const post = await Post.findById(postId)
    .populate("user")
    .populate({
      path: "comments",
      populate: [
        { path: "user" },
        {
          path: "replies",
          populate: { path: "user" }
        }
      ]
    });
  return formatPost(post, currentUserId);
};

// =========================
// CREATE POST
// =========================
exports.createPost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { content, image } = req.body;

    const newPost = await Post.create({
      user: userId,
      content,
      image: image || "",
    });

    // Increment user's post count
    await User.findByIdAndUpdate(userId, { $inc: { postsCount: 1 } });

    const formatted = await populateAndFormat(newPost._id, userId);
    res.status(201).json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =========================
// GET ALL POSTS (FEED)
// =========================
exports.getAllPosts = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    const posts = await Post.find({})
      .populate("user")
      .populate({
        path: "comments",
        populate: [
          { path: "user" },
          {
            path: "replies",
            populate: { path: "user" }
          }
        ]
      })
      .sort({ createdAt: -1 });

    res.json(posts.map((p) => formatPost(p, currentUserId)));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =========================
// GET SINGLE POST
// =========================
exports.getPostById = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const formatted = await populateAndFormat(req.params.id, currentUserId);

    if (!formatted) return res.status(404).json({ message: "Post not found" });

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =========================
// LIKE / UNLIKE POST
// =========================
exports.likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const currentUserId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const alreadyLiked = post.likedBy.some(
      (id) => id.toString() === currentUserId
    );

    if (alreadyLiked) {
      post.likedBy.pull(currentUserId);
    } else {
      post.likedBy.push(currentUserId);

      // Notify post owner (not self-likes)
      if (post.user.toString() !== currentUserId) {
        const liker = await User.findById(currentUserId).select("name");
        await Notification.create({
          user: post.user,
          type: "like",
          fromUser: currentUserId,
          post: post._id,
          text: `${liker?.name || "Someone"} liked your post.`,
        });
      }
    }

    await post.save();

    const formatted = await populateAndFormat(post._id, currentUserId);
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =========================
// BOOKMARK / UNBOOKMARK
// =========================
exports.bookmarkPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const currentUserId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const alreadyBookmarked = post.bookmarkedBy.some(
      (id) => id.toString() === currentUserId
    );

    if (alreadyBookmarked) {
      post.bookmarkedBy.pull(currentUserId);
    } else {
      post.bookmarkedBy.push(currentUserId);
    }

    await post.save();

    const formatted = await populateAndFormat(post._id, currentUserId);
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};