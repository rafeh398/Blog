import React, { useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useBlog } from "../context/BlogContext";

const PostDetail = () => {
  const { id } = useParams();
  const { singlePost, fetchSinglePost, user } = useBlog();

  // Redirect if not authenticated
  if (user === null) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    fetchSinglePost(id);
  }, [id]);

  if (!singlePost) return <p className="text-center">Loading post...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      {singlePost.image && (
        <img
          src={singlePost.image}
          alt={singlePost.title}
          className="w-full h-80 object-cover rounded mb-6"
        />
      )}
      <h1 className="text-3xl font-bold mb-4">{singlePost.title}</h1>
      <p className="text-gray-800">{singlePost.content}</p>
    </div>
  );
};

export default PostDetail;
