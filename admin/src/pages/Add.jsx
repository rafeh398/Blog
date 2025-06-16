import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { backendUrl } from "../config"; // Make sure this returns your base API URL
import { assets } from "../assets/admin_assets/assets"; // Replace with your upload icon or placeholder

function Add() {
  const navigate = useNavigate();
  const [image, setImage] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (image) {
        formData.append("image", image);
      }

      const response = await axios.post(`${backendUrl}/api/v1/posts/add`, formData, {
        withCredentials: true,
      });

      if (response.data.success) {
        toast.success(response.data.message || "Post added successfully");
        setTitle("");
        setContent("");
        setImage(false);

        setTimeout(() => {
          navigate("/list"); // Go back to blog list
        }, 1000);
      } else {
        toast.error(response.data.message || "Failed to add post");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Server error");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Add Blog Post</h2>
      <form onSubmit={onSubmitHandler} className="flex flex-col gap-4">
        <div>
          <p className="mb-2 font-medium">Upload Image</p>
          <label htmlFor="image">
            <img
              className="w-32 h-32 object-cover cursor-pointer border rounded"
              src={!image ? assets.upload_area : URL.createObjectURL(image)}
              alt="Preview"
            />
            <input
              type="file"
              id="image"
              hidden
              onChange={(e) => setImage(e.target.files[0])}
            />
          </label>
        </div>

        <div>
          <p className="mb-2 font-medium">Post Title</p>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded"
            placeholder="Enter post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <p className="mb-2 font-medium">Post Content</p>
          <textarea
            className="w-full px-4 py-2 border rounded min-h-[150px]"
            placeholder="Enter post content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition"
        >
          Submit Post
        </button>
      </form>
    </div>
  );
}

export default Add;
