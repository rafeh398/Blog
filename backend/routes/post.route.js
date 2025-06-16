import express from "express";
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
} from "../controllers/post.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyAdminJWT } from "../middlewares/adminAuth.middleware.js";

const postRouter = express.Router();

// 🔓 Public
postRouter.get("/list", getAllPosts);
postRouter.post("/single", getPostById);

// 🔐 Admin-only
postRouter.post(
  "/add",
  verifyAdminJWT,
  upload.single("image"),
  createPost
);

postRouter.post(
  "/update",         
  verifyAdminJWT,
  upload.single("image"),
  updatePost
);

postRouter.delete("/delete", verifyAdminJWT, deletePost);

export default postRouter;
