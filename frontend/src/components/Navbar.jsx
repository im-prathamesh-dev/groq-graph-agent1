import React from 'react';
import { useAuthStore } from '../store/authStore';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, LogOut, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/40 dark:border-slate-800/40 px-6 py-3 flex items-center justify-between">
      {/* Search Bar / Panel Title */}
      <div className="hidden sm:flex items-center text-sm text-slate-400 dark:text-slate-500 font-medium">
        Active Workspace &bull; AI Grading System v1.0
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-4 ml-auto">
        {/* Dark/Light mode toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-slate-500 hover:text-blue-500 dark:text-slate-400 dark:hover:text-blue-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all duration-200"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5 animate-pulse" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>

        {/* User Card */}
        {user && (
          <div className="flex items-center gap-3 border-l border-slate-200/50 dark:border-slate-800/50 pl-4">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                {user.username}
              </span>
              <span className="text-xs text-slate-400 capitalize">
                {user.role} workspace
              </span>
            </div>
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
              {user.username.charAt(0).toUpperCase()}
            </div>
            
            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="p-2 ml-1 text-slate-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all duration-200"
              title="Logout Session"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
