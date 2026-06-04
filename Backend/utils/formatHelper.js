/**
 * formatHelper.js
 * Transforms Mongoose documents into the exact shape the React frontend expects.
 * Handles: _id -> id, relative timestamps, isLiked/isBookmarked/isFollowing per-user checks.
 */

// ===================================================
// RELATIVE TIME STRING  e.g. "Just now", "5m ago"
// ===================================================
const getRelativeTime = (date) => {
  if (!date) return "";
  const now = Date.now();
  const diff = now - new Date(date).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 30) return "Just now";
  if (minutes < 1) return `${seconds}s ago`;
  if (hours < 1) return `${minutes}m ago`;
  if (days < 1) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

// ===================================================
// FORMAT USER
// ===================================================
const formatUser = (user, currentUserId) => {
  if (!user) return null;
  const u = user.toObject ? user.toObject() : user;
  const followersArr = u.followers || [];
  const followingArr = u.following || [];

  return {
    id: u._id?.toString() || u.id,
    name: u.name || "",
    username: u.username || "",
    avatar: u.avatar || "",
    coverImage: u.coverImage || "",
    bio: u.bio || "",
    website: u.website || "",
    location: u.location || "",
    joinDate: u.joinDate || "",
    followersCount: followersArr.length,
    followingCount: followingArr.length,
    postsCount: u.postsCount || 0,
    isVerified: u.isVerified || false,
    // Check if current user follows this user
    isFollowing: currentUserId
      ? followersArr.some((id) => id?.toString() === currentUserId?.toString())
      : false,
  };
};

// ===================================================
// FORMAT COMMENT (recursive for replies)
// ===================================================
const formatComment = (comment, currentUserId) => {
  if (!comment) return null;
  const c = comment.toObject ? comment.toObject() : comment;
  const likedBy = c.likedBy || [];

  const formattedReplies = (c.replies || []).map((r) => {
    if (typeof r === "object" && r !== null && !r._id) return null; // unpopulated stub
    return formatComment(r, currentUserId);
  }).filter(Boolean);

  return {
    id: c._id?.toString() || c.id,
    postId: c.postId?.toString() || "",
    user: c.user && typeof c.user === "object" ? formatUser(c.user, currentUserId) : { id: c.user?.toString() },
    content: c.content || "",
    timestamp: getRelativeTime(c.createdAt),
    likes: likedBy.length,
    isLiked: currentUserId
      ? likedBy.some((id) => id?.toString() === currentUserId?.toString())
      : false,
    replies: formattedReplies,
  };
};

// ===================================================
// FORMAT POST
// ===================================================
const formatPost = (post, currentUserId) => {
  if (!post) return null;
  const p = post.toObject ? post.toObject() : post;
  const likedBy = p.likedBy || [];
  const bookmarkedBy = p.bookmarkedBy || [];

  const formattedComments = (p.comments || []).map((c) => {
    if (!c || typeof c !== "object") return null;
    return formatComment(c, currentUserId);
  }).filter(Boolean);

  return {
    id: p._id?.toString() || p.id,
    user: p.user && typeof p.user === "object" ? formatUser(p.user, currentUserId) : { id: p.user?.toString() },
    timestamp: getRelativeTime(p.createdAt),
    content: p.content || "",
    image: p.image || undefined,
    likes: likedBy.length,
    commentsCount: p.commentsCount || 0,
    shares: p.shares || 0,
    isLiked: currentUserId
      ? likedBy.some((id) => id?.toString() === currentUserId?.toString())
      : false,
    isBookmarked: currentUserId
      ? bookmarkedBy.some((id) => id?.toString() === currentUserId?.toString())
      : false,
    comments: formattedComments,
  };
};

module.exports = { formatUser, formatPost, formatComment, getRelativeTime };
