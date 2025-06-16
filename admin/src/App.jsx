import React, { useEffect, useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import Add from '../src/pages/Add';

import List from '../src/pages/List';
import { ToastContainer } from "react-toastify";
import { backendUrl } from "./config";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Show loading before auth check finishes

  useEffect(() => {
    axios
      .get(`${backendUrl}/api/v1/user/admin/status`, { withCredentials: true })
      .then(() => setIsAuthenticated(true))
      .catch(() => setIsAuthenticated(false))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center mt-10">Checking login...</div>;

  if (!isAuthenticated) {
    return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer/>
      <Navbar onLogout={() => setIsAuthenticated(false)} />
      <hr />
      <div className="flex">
        <Sidebar />
        <div className="w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base">
          <Routes>
            <Route path="/add" element={<Add />} />
            <Route path="/list" element={<List />} />
        
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
