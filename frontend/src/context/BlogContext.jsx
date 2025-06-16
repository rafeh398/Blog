import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const BlogContext = createContext();
export const useBlog = () => useContext(BlogContext);

export const BlogProvider = ({ children }) => {
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const [posts, setPosts] = useState([]);
  const [singlePost, setSinglePost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // Fetch all posts
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${backendURL}/api/v1/posts/list`);
      if (res.data.success) {
        setPosts(res.data.data);
      } else {
        toast.error(res.data.message || "Failed to load posts.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error fetching posts.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch a single post by ID
  const fetchSinglePost = async (postId) => {
    try {
      const res = await axios.post(`${backendURL}/api/v1/posts/single`, { postId });
      if (res.data.success) {
        setSinglePost(res.data.data);
      } else {
        toast.error(res.data.message || "Post not found.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error fetching post.");
    }
  };

  // Check current user authentication status
  const checkUserStatus = async () => {
    try {
      const res = await axios.get(`${backendURL}/api/v1/user/status`, {
        withCredentials: true,
      });
      if (res.data.loggedIn) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error checking user status", error);
      setUser(null);
    }
  };

  // Run on app start
  useEffect(() => {
    checkUserStatus();
    fetchPosts();
  }, []);

  return (
    <BlogContext.Provider
      value={{
        posts,
        singlePost,
        fetchPosts,
        fetchSinglePost,
        loading,
        user,
        setUser,
        checkUserStatus,
        backendURL,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};
