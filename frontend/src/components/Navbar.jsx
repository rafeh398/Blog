import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useBlog } from "../context/BlogContext";
import { toast } from "react-toastify";
export default function Navbar() {
  const { user, backendURL, setUser } = useBlog();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(`${backendURL}/api/v1/user/logout`, {}, { withCredentials: true });
      setUser(null);
      toast.success("Logged out");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <nav className="bg-gray-900 text-white p-4 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">MyBlog</Link>
        <div>
          {user && (
            <button onClick={handleLogout} className="hover:underline bg-transparent border-none cursor-pointer text-white">
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
