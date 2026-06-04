const User = require("../models/User");
const Notification = require("../models/Notification");
const { formatUser } = require("../utils/formatHelper");

// =========================
// GET PROFILE BY USERNAME
// =========================
exports.getUserProfile = async (req, res) => {
  try {
    const username = req.params.username;
    const currentUserId = req.user?.id; // optional auth

    const user = await User.findOne({ username });

    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.json(formatUser(user, currentUserId));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =========================
// UPDATE PROFILE
// =========================
exports.updateProfile = async (req, res) => {
  try {
    const id = req.user.id;

    const allowedFields = ["name", "bio", "website", "location", "avatar", "coverImage"];
    const updates = {};
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    const updated = await User.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    );

    res.json(formatUser(updated, id));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =========================
// FOLLOW / UNFOLLOW
// =========================
exports.followUser = async (req, res) => {
  try {
    const targetUsername = req.params.username;
    const currentUserId = req.user.id;

    const targetUser = await User.findOne({ username: targetUsername });
    const currentUser = await User.findById(currentUserId);

    if (!targetUser)
      return res.status(404).json({ message: "User not found" });

    if (targetUser._id.toString() === currentUserId)
      return res.status(400).json({ message: "Cannot follow yourself" });

    const isFollowing = targetUser.followers.some(
      (id) => id.toString() === currentUserId
    );

    if (isFollowing) {
      // Unfollow
      targetUser.followers.pull(currentUserId);
      currentUser.following.pull(targetUser._id);
    } else {
      // Follow
      targetUser.followers.push(currentUserId);
      currentUser.following.push(targetUser._id);

      // Create follow notification
      await Notification.create({
        user: targetUser._id,
        type: "follow",
        fromUser: currentUserId,
        text: `${currentUser.name} started following you.`,
      });
    }

    await targetUser.save();
    await currentUser.save();

    res.json({ success: true, isFollowing: !isFollowing });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};