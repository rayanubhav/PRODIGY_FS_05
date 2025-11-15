import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
    },
    hashtags: [
      {
        type: String,
        lowercase: true,
      },
    ],
    img: {
      type: String,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        text: {
          type: String,
          required: true,
        },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

// ADDED: Database Indexes for Performance
postSchema.index({ createdAt: -1 }); // For trending
postSchema.index({ user: 1 }); // For user posts
postSchema.index({ likes: 1 }); // For engagement
postSchema.index({ createdAt: -1, likes: -1 }); // Compound for trending

export default Post;
