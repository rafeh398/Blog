import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";
import { Post } from "../models/post.model.js";

// ✅ Create a new post (Admin only)
const createPost = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    throw new ApiError(400, "Title and content are required.");
  }

  let imageUrl = "";
  if (req.file?.path) {
    const result = await uploadOnCloudinary(req.file.path);
    imageUrl = result.secure_url;
  }

  const post = await Post.create({ title, content, image: imageUrl });

  return res
    .status(201)
    .json(new ApiResponse(201, post, "Post created successfully"));
});

// ✅ Get all posts (Public)
const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, posts, "Posts fetched successfully"));
});

// ✅ Get a single post
const getPostById = asyncHandler(async (req, res) => {
  const { postId } = req.body;

  if (!postId) {
    throw new ApiError(400, "Post ID is required.");
  }

  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, "Post not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, post, "Single post fetched successfully"));
});

// ✅ Update a post (Admin only)
const updatePost = asyncHandler(async (req, res) => {
  const { id, title, content } = req.body;

  if (!id) throw new ApiError(400, "Post ID is required");

  const existingPost = await Post.findById(id);
  if (!existingPost) throw new ApiError(404, "Post not found");

  let imageUrl = existingPost.image;

  if (req.file?.path) {
    const result = await uploadOnCloudinary(req.file.path);
    imageUrl = result.secure_url;
  }

  existingPost.title = title || existingPost.title;
  existingPost.content = content || existingPost.content;
  existingPost.image = imageUrl;

  const updatedPost = await existingPost.save();

  return res
    .status(200)
    .json(new ApiResponse(200, updatedPost, "Post updated successfully"));
});

// ✅ Delete a post (Admin only)
const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    throw new ApiError(400, "Post ID is required.");
  }

  const post = await Post.findById(id);
  if (!post) {
    throw new ApiError(404, "Post not found.");
  }

  await Post.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Post deleted successfully"));
});

export {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
};
