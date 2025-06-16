import React from "react";
import { useBlog } from "../context/BlogContext";
import { Link, Navigate } from "react-router-dom";

const BlogList = () => {
  const { posts, loading, user } = useBlog();

  // ✅ Redirect to login if user is not authenticated
  if (user === null) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Show loading state
  if (loading) {
    return <p className="text-center">Loading posts...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Blog Posts</h1>
      {posts.map((post) => (
        <Link to={`/post/${post._id}`} key={post._id}>
          <div className="bg-white shadow p-4 rounded mb-4 hover:bg-gray-50 transition">
            {post.image && (
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-96 object-contain rounded mb-3"
              />
            )}
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="text-gray-600 line-clamp-2">{post.content}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default BlogList;
