import mongoose, { Schema } from "mongoose";

const postSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  content: {
    type: String,
    required: true,
  },

  image: {
    type: String, // Cloudinary URL
    required: false,
  },
}, { timestamps: true });

export const Post = mongoose.model("Post", postSchema);
