import React from 'react';
import { NavLink } from "react-router-dom";
import { assets } from "../assets/admin_assets/assets";

function Sidebar() {
  return (
    <div className="w-[18%] border-r-2 min-h-screen">
      <div className="flex flex-col gap-4 pt-6 pl-[20%] text-[15px]">
        <NavLink to="/add" className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-1">
          <img src={assets.add_icon} className="w-5 h-5" />
          <p className="hidden md:block">Add Posts</p>
        </NavLink>
        <NavLink to="/list" className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-1">
          <img src={assets.order_icon} className="w-5 h-5" />
          <p className="hidden md:block">List Posts</p>
        </NavLink>
       
      </div>
    </div>
  );
}

export default Sidebar;
