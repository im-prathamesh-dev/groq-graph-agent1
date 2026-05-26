import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import {
  LayoutDashboard,
  FileText,
  ScanEye,
  ScrollText,
  ShieldCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuthStore();

  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Resumes', path: '/resumes', icon: FileText },
    { name: 'Job Matching', path: '/match', icon: ScanEye },
    { name: 'Cover Letters', path: '/cover-letters', icon: ScrollText },
  ];

  // If user is admin, inject admin route
  if (user && user.role === 'admin') {
    links.push({ name: 'Admin Console', path: '/admin', icon: ShieldCheck });
  }

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 z-50 glass-panel border-r border-slate-200/40 dark:border-slate-800/40 flex flex-col justify-between py-6">
      {/* Brand Header Logo */}
      <div className="px-6 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 animate-pulse-slow">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <span className="font-display font-extrabold text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-300 tracking-wide">
            ResuMind AI
          </span>
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
            SaaS Platform
          </span>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="mt-8 flex-1 px-4 space-y-1.5 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 dark:border-blue-400/15 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100/50 dark:hover:bg-slate-800/40 border border-transparent'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-3">
                  <link.icon
                    className={`h-5 w-5 transition-transform duration-200 group-hover:scale-110 ${
                      isActive
                        ? 'text-blue-500 dark:text-blue-400'
                        : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-400'
                    }`}
                  />
                  <span>{link.name}</span>
                </div>
                <ChevronRight
                  className={`h-4 w-4 opacity-0 transition-all duration-200 ${
                    isActive ? 'opacity-100 text-blue-500 dark:text-blue-400' : 'group-hover:opacity-40 text-slate-400'
                  }`}
                />
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer / System Status */}
      <div className="px-6 border-t border-slate-200/50 dark:border-slate-800/50 pt-4">
        <div className="rounded-xl bg-slate-100/60 dark:bg-slate-800/30 p-3.5 border border-slate-200/30 dark:border-slate-700/20">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-glow-ring" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Ollama Pipeline
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            Running locally on port 11434 with nomic & llama3.
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
