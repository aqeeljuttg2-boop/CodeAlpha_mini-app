const Notification = require("../models/Notification");
const { getRelativeTime } = require("../utils/formatHelper");

// Helper: format a single DB notification into frontend shape
const formatNotification = (n) => {
  if (!n) return null;
  const fromUser = n.fromUser && typeof n.fromUser === "object" ? n.fromUser : null;
  const post = n.post && typeof n.post === "object" ? n.post : null;

  return {
    id: n._id?.toString(),
    type: n.type,
    user: fromUser
      ? {
          id: fromUser._id?.toString(),
          name: fromUser.name || "",
          username: fromUser.username || "",
          avatar: fromUser.avatar || "",
          followersCount: (fromUser.followers || []).length,
          followingCount: (fromUser.following || []).length,
          postsCount: fromUser.postsCount || 0,
          joinDate: fromUser.joinDate || "",
          isVerified: fromUser.isVerified || false,
        }
      : null,
    post: post
      ? {
          id: post._id?.toString(),
          content: post.content || "",
        }
      : undefined,
    timestamp: getRelativeTime(n.createdAt),
    read: n.read || false,
    text: n.text || "",
  };
};

// =========================
// GET ALL NOTIFICATIONS FOR CURRENT USER
// =========================
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const notifications = await Notification.find({ user: userId })
      .populate("fromUser")
      .populate("post", "content")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(notifications.map(formatNotification).filter(Boolean));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =========================
// MARK ALL NOTIFICATIONS AS READ
// =========================
exports.markAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    await Notification.updateMany(
      { user: userId, read: false },
      { $set: { read: true } }
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};