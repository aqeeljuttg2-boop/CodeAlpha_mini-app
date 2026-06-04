const User = require("../models/User");
const Post = require("../models/Post");
const { formatUser, formatPost } = require("../utils/formatHelper");

// =========================
// GET EXPLORE PAGE DATA
// =========================
exports.getExploreData = async (req, res) => {
  try {
    const currentUserId = req.user?.id;

    // Trending posts = posts with most likes
    const trendingPosts = await Post.find({})
      .sort({ likedBy: -1 })
      .limit(10)
      .populate("user")
      .populate({
        path: "comments",
        populate: { path: "user" }
      });

    // Suggested creators = users with most followers, excluding current user
    const creatorsQuery = currentUserId
      ? { _id: { $ne: currentUserId } }
      : {};

    const creators = await User.find(creatorsQuery)
      .sort({ followers: -1 })
      .limit(10);

    // Build trendingTags from post content (hashtag extraction)
    const allPosts = await Post.find({}).select("content");
    const tagMap = {};
    allPosts.forEach((p) => {
      const matches = (p.content || "").match(/#\w+/g) || [];
      matches.forEach((tag) => {
        const normalized = tag.toLowerCase().replace("#", "");
        tagMap[normalized] = (tagMap[normalized] || 0) + 1;
      });
    });

    const trendingTags = Object.entries(tagMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([tag, count], idx) => ({
        id: `tag_${idx}`,
        tag,
        postsCount: count,
      }));

    res.json({
      trending: trendingTags,
      creators: creators.map((u) => formatUser(u, currentUserId)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =========================
// SEARCH USERS & POSTS
// =========================
exports.searchContent = async (req, res) => {
  try {
    const currentUserId = req.user?.id;
    const { query } = req.body;

    if (!query || query.trim() === "") {
      return res.json({ posts: [], users: [] });
    }

    const regex = new RegExp(query.trim(), "i");

    const posts = await Post.find({ content: regex })
      .populate("user")
      .populate({
        path: "comments",
        populate: { path: "user" }
      })
      .sort({ createdAt: -1 })
      .limit(20);

    const users = await User.find({
      $or: [{ name: regex }, { username: regex }, { bio: regex }]
    }).limit(10);

    res.json({
      posts: posts.map((p) => formatPost(p, currentUserId)),
      users: users.map((u) => formatUser(u, currentUserId)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};