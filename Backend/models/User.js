const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    username: {
      type: String,
      required: true,
      unique: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    avatar: {
      type: String,
      default: ""
    },

    coverImage: {
      type: String,
      default: ""
    },

    bio: {
      type: String,
      default: ""
    },

    website: {
      type: String,
      default: ""
    },

    location: {
      type: String,
      default: ""
    },

    joinDate: {
      type: String,
      default: ""
    },

    // Array-based relationships for accurate multi-user tracking
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    postsCount: {
      type: Number,
      default: 0
    },

    isVerified: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);