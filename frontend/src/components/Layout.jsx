import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useAuthStore } from '../store/authStore';
import { motion } from 'framer-motion';

const Layout = () => {
  const { token, loadUser, user } = useAuthStore();
  const navigate = useNavigate();

  // Route security - if no token, push to login
  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      loadUser();
    }
  }, [token, navigate]);

  if (!token) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-200">
      {/* Permanent full height left side panel */}
      <Sidebar />

      {/* Main content grid */}
      <div className="flex-1 pl-64 flex flex-col min-h-screen overflow-x-hidden">
        {/* Top Navbar */}
        <Navbar />

        {/* Dynamic page area */}
        <main className="flex-grow p-8 radial-glow-indigo grid-bg-overlay">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="w-full max-w-7xl mx-auto space-y-8"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
