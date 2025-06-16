import React from 'react';
import { assets } from "../assets/admin_assets/assets";
import axios from "axios";
import { backendUrl } from "../config";
import { toast } from "react-toastify";

function Navbar({ onLogout }) {
  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${backendUrl}/api/v1/user/admin/logout`, {}, { withCredentials: true });

      if (response.data.success) {
        toast.success("Successfully logged out");
        onLogout(); // <-- tell App to update auth state
      }
    } catch (error) {
      console.log(error);
      toast.error("Error while logging out");
    }
  };

  return (
    <div className="flex items-center py-2 px-[4%] justify-between">
             <p className="text-xl font-bold">MyBlog</p>

      <button
        onClick={handleLogout}
        className="bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm"
      >
        Logout
      </button>
    </div>
  );
}

export default Navbar;
