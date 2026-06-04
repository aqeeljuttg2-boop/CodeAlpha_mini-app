const Comment = require("../models/Comment");
const Post = require("../models/Post");
const User = require("../models/User");
const Notification = require("../models/Notification");
const { formatPost } = require("../utils/formatHelper");

// Helper: fetch and return the fully populated, formatted parent post
const getFormattedPost = async (postId, currentUserId) => {
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
// ADD COMMENT
// =========================
exports.addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    const { content } = req.body;

    if (!content?.trim())
      return res.status(400).json({ message: "Comment content is required" });

    const newComment = await Comment.create({
      postId,
      user: userId,
      content: content.trim(),
    });

    // Add comment ref to post and increment count
    await Post.findByIdAndUpdate(postId, {
      $inc: { commentsCount: 1 },
      $push: { comments: newComment._id }
    });

    const post = await Post.findById(postId);

    // Notify post owner (not self-comments)
    if (post && post.user.toString() !== userId) {
      const commenter = await User.findById(userId).select("name");
      await Notification.create({
        user: post.user,
        type: "comment",
        fromUser: userId,
        post: postId,
        text: `${commenter?.name || "Someone"} commented: "${content.trim().substring(0, 40)}${content.length > 40 ? "..." : ""}"`,
      });
    }

    // Return the full formatted post so the frontend can update state correctly
    const formatted = await getFormattedPost(postId, userId);
    res.status(201).json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =========================
// LIKE / UNLIKE COMMENT
// =========================
exports.likeComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const currentUserId = req.user.id;
    const { commentId } = req.body;

    const comment = await Comment.findById(commentId);
    if (!comment)
      return res.status(404).json({ message: "Comment not found" });

    const alreadyLiked = comment.likedBy.some(
      (id) => id.toString() === currentUserId
    );

    if (alreadyLiked) {
      comment.likedBy.pull(currentUserId);
    } else {
      comment.likedBy.push(currentUserId);
    }

    await comment.save();

    const formatted = await getFormattedPost(postId, currentUserId);
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =========================
// REPLY TO COMMENT
// =========================
exports.replyToComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    const { commentId, content } = req.body;

    if (!content?.trim())
      return res.status(400).json({ message: "Reply content is required" });

    const parent = await Comment.findById(commentId);
    if (!parent)
      return res.status(404).json({ message: "Comment not found" });

    const reply = await Comment.create({
      postId,
      user: userId,
      content: content.trim(),
    });

    parent.replies.push(reply._id);
    await parent.save();

    // Increment post comment count
    await Post.findByIdAndUpdate(postId, {
      $inc: { commentsCount: 1 }
    });

    const formatted = await getFormattedPost(postId, userId);
    res.status(201).json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};