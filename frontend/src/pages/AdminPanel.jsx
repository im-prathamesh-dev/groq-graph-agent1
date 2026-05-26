import React, { useEffect } from 'react';
import { useResumeStore } from '../store/resumeStore';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Loader2,
  Users,
  Files,
  Cpu,
  Mail,
  UserCheck,
  Calendar,
  Sparkles,
  BarChart4
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const AdminPanel = () => {
  const { adminStats, loadingAdmin, fetchAdminStats, error } = useResumeStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Route validation - send away if not admin
    if (user && user.role !== 'admin') {
      navigate('/dashboard');
    } else {
      fetchAdminStats();
    }
  }, [user, navigate]);

  if (loadingAdmin && !adminStats) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
        <p className="text-sm font-semibold text-slate-500">Compiling Analytics Database...</p>
      </div>
    );
  }

  if (error || (user && user.role !== 'admin')) {
    return (
      <div className="py-20 text-center space-y-4 max-w-sm mx-auto">
        <ShieldAlert className="h-12 w-12 text-red-500 mx-auto animate-bounce" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Access Violation</h3>
        <p className="text-xs text-slate-400">
          Your profile account is not flagged as an Administrator.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  if (!adminStats) return null;

  const { metrics, uploadsHistory, analysesHistory, users } = adminStats;

  // Prepare simple time-series data for the area charts
  // Merge histories by date or display them side-by-side
  const chartData = uploadsHistory.map(item => {
    const matchingAnalysis = analysesHistory.find(a => a._id === item._id);
    return {
      date: item._id,
      Uploads: item.count,
      Analyses: matchingAnalysis ? matchingAnalysis.count : 0,
    };
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
          Admin Console <Sparkles className="h-7 w-7 text-yellow-500" />
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Monitor MERN system utilization, user directories, and local AI operation counters.
        </p>
      </div>

      {/* Grid: Admin Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card p-6 flex items-center gap-5">
          <div className="h-12 w-12 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-500">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold block uppercase">Total Users</span>
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{metrics.totalUsers}</span>
          </div>
        </div>

        <div className="glass-card p-6 flex items-center gap-5">
          <div className="h-12 w-12 rounded-xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-500">
            <Files className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold block uppercase">Total Resumes</span>
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{metrics.totalResumes}</span>
          </div>
        </div>

        <div className="glass-card p-6 flex items-center gap-5">
          <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-500">
            <Cpu className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold block uppercase">AI RAG operations</span>
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{metrics.totalAiOperations}</span>
          </div>
        </div>
      </div>

      {/* Uploads and Analyses volumes over time Chart */}
      <div className="glass-panel p-6 rounded-2xl overflow-hidden min-w-0">
        <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-5 flex items-center gap-2">
          <BarChart4 className="h-5 w-5 text-blue-500" /> Platform Usage History (Last 7 Days)
        </h3>
        
        {chartData.length > 0 ? (
          <div className="mt-4 min-h-[280px] w-full">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="uploadsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="analysesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3341551A" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: '#0f172a',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="Uploads" stroke="#3b82f6" fillOpacity={1} fill="url(#uploadsGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="Analyses" stroke="#8b5cf6" fillOpacity={1} fill="url(#analysesGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-xs italic">
            Insufficient history data to plot chart. Add new uploads to trigger metrics tracking.
          </div>
        )}
      </div>

      {/* User Directories Directory Table */}
      <div className="glass-panel p-6 rounded-2xl">
        <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-5">
          Registered Accounts Directory
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/50 dark:border-slate-800/40 text-slate-400 text-xs font-semibold uppercase">
                <th className="pb-3">Username</th>
                <th className="pb-3">Email Address</th>
                <th className="pb-3">System Role</th>
                <th className="pb-3 text-right">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-sm">
              {users.map((item) => (
                <tr key={item._id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                  <td className="py-4 font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-3">
                    <UserCheck className="h-4 w-4 text-blue-500 shrink-0" />
                    <span>{item.username}</span>
                  </td>
                  <td className="py-4 text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span>{item.email}</span>
                  </td>
                  <td className="py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      item.role === 'admin'
                        ? 'bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 border border-purple-200/50 dark:border-purple-800/40'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                      {item.role}
                    </span>
                  </td>
                  <td className="py-4 text-slate-400 text-right flex items-center justify-end gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
