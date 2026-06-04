const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    content: {
      type: String,
      default: ""
    },

    image: {
      type: String,
      default: ""
    },

    // Array of user IDs who liked this post (enables per-user isLiked checks)
    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    // Array of user IDs who bookmarked this post
    bookmarkedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    commentsCount: {
      type: Number,
      default: 0
    },

    shares: {
      type: Number,
      default: 0
    },

    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);