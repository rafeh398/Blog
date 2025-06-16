import axios from "axios";
import React, { useState, useEffect } from "react";
import { backendUrl } from "../config";
import { toast } from "react-toastify";

function BlogAdminList() {
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null); // currently editing post
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: null, // For image file upload if you want
  });

  // Fetch all posts
  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/v1/posts/list`);
      if (response.data.success) {
        setPosts(response.data.data);
      } else {
        toast.error(response.data.message || "Failed to fetch posts");
      }
    } catch (error) {
      toast.error(error.message || "Server error while fetching posts");
    }
  };

  // Delete post by id
  const removePost = async (id) => {
    try {
      const response = await axios.delete(`${backendUrl}/api/v1/posts/delete`, {
        data: { id },
        withCredentials: true,
      });

      if (response.data.success) {
        toast.success(response.data.message || "Post deleted");
        setPosts((prevPosts) => prevPosts.filter((post) => post._id !== id));
      } else {
        toast.error(response.data.message || "Failed to delete post");
      }
    } catch (error) {
      toast.error(error.message || "Error deleting post");
    }
  };

  // Open update form with selected post data
  const startEditing = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      image: null, // reset image, or you can handle preview separately
    });
  };

  // Handle input changes in the form
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Submit update form
  const submitUpdate = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.content) {
      toast.error("Title and Content are required");
      return;
    }

    try {
      const form = new FormData();
      form.append("id", editingPost._id);
      form.append("title", formData.title);
      form.append("content", formData.content);
      if (formData.image) {
        form.append("image", formData.image);
      }

      const response = await axios.post(
        `${backendUrl}/api/v1/posts/update`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("Post updated successfully");
        setEditingPost(null);
        setFormData({ title: "", content: "", image: null });
        fetchPosts();
      } else {
        toast.error(response.data.message || "Failed to update post");
      }
    } catch (error) {
      toast.error(error.message || "Error updating post");
    }
  };

  // Cancel update form
  const cancelEditing = () => {
    setEditingPost(null);
    setFormData({ title: "", content: "", image: null });
  };

  // Load posts on mount
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">All Blog Posts</h2>

      {/* Update form, shows only if editing */}
      {editingPost && (
        <form
          onSubmit={submitUpdate}
          className="mb-6 p-4 border rounded bg-gray-50"
        >
          <h3 className="text-xl font-semibold mb-4">Update Post</h3>

          <div className="mb-3">
            <label className="block mb-1 font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div className="mb-3">
            <label className="block mb-1 font-medium">Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              rows="4"
              required
            />
          </div>

          <div className="mb-3">
            <label className="block mb-1 font-medium">Image (optional)</label>
            <input type="file" name="image" onChange={handleChange} />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Save Update
            </button>
            <button
              type="button"
              onClick={cancelEditing}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Table headers */}
      <div className="hidden md:grid grid-cols-[1fr_3fr_3fr_2fr] gap-4 bg-gray-100 p-2 border-b text-sm font-medium">
        <span>Image</span>
        <span>Title</span>
        <span>Content</span>
        <span className="text-center">Actions</span>
      </div>

      {/* Posts list */}
      <div className="flex flex-col gap-2">
        {posts.map((post) => (
          <div
            key={post._id}
            className="grid grid-cols-1 md:grid-cols-[1fr_3fr_3fr_2fr] gap-4 items-center p-2 border rounded-sm text-sm"
          >
            <img
              src={post.image}
              alt={post.title}
              className="w-16 h-16 object-cover rounded"
            />
            <p>{post.title}</p>
            <p className="line-clamp-2">{post.content}</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => startEditing(post)}
                className="text-blue-600 font-semibold hover:underline"
              >
                Update
              </button>
              <button
                onClick={() => removePost(post._id)}
                className="text-red-600 font-semibold hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BlogAdminList;
