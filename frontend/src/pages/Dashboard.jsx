import React, { useEffect, useState, useRef } from 'react';
import { useResumeStore } from '../store/resumeStore';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  FileText,
  TrendingUp,
  Award,
  Sparkles,
  Search,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const Dashboard = () => {
  const {
    resumes,
    analyses,
    loadingResumes,
    loadingAnalyses,
    fetchResumes,
    fetchAnalyses,
    uploadResume,
    deleteResume,
    analyzeResume,
  } = useResumeStore();
  
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({ loading: false, success: false, error: null });
  const [processingState, setProcessingState] = useState({ loading: false, id: null });
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchResumes();
    fetchAnalyses();
  }, []);

  // Handle file drops
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      await processUpload(e.target.files[0]);
    }
  };

  const processUpload = async (file) => {
    setUploadStatus({ loading: true, success: false, error: null });
    const result = await uploadResume(file);
    if (result) {
      setUploadStatus({ loading: false, success: true, error: null });
      // Reset success status after a delay
      setTimeout(() => setUploadStatus(prev => ({ ...prev, success: false })), 4000);
    } else {
      setUploadStatus({ loading: false, success: false, error: 'Upload failed. Supported formats: .pdf, .txt, .md' });
    }
  };

  const triggerUploadClick = () => {
    fileInputRef.current.click();
  };

  // Run AI grading pipeline
  const runAiGrade = async (resumeId) => {
    setProcessingState({ loading: true, id: resumeId });
    const analysis = await analyzeResume(resumeId);
    setProcessingState({ loading: false, id: null });
    if (analysis) {
      navigate(`/analyses/${analysis._id}`);
    }
  };

  // Prepare chart data from the most recent analysis
  const recentAnalysis = analyses[0];
  const chartData = recentAnalysis
    ? [
        { name: 'Overall', Score: recentAnalysis.scores.overall },
        { name: 'ATS Optimize', Score: recentAnalysis.scores.ats },
        { name: 'Skills Match', Score: recentAnalysis.scores.skills },
        { name: 'Experience', Score: recentAnalysis.scores.experience },
        { name: 'Formatting', Score: recentAnalysis.scores.formatting },
        { name: 'Readability', Score: recentAnalysis.scores.readability },
      ]
    : [];

  return (
    <div className="space-y-8">
      {/* Welcome Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Hello, {user?.username} <Sparkles className="h-6 w-6 text-yellow-500 fill-yellow-500" />
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Analyze and optimize your career blueprints against modern ATS systems.
          </p>
        </div>
      </div>

      {/* Grid of Key Numerical Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 flex items-center gap-5">
          <div className="h-12 w-12 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-500">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold block uppercase">Resumes Stored</span>
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{resumes.length}</span>
          </div>
        </div>

        <div className="glass-card p-6 flex items-center gap-5">
          <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-500">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold block uppercase">AI Reports</span>
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{analyses.length}</span>
          </div>
        </div>

        <div className="glass-card p-6 flex items-center gap-5">
          <div className="h-12 w-12 rounded-xl bg-yellow-500/10 border border-yellow-500/25 flex items-center justify-center text-yellow-500">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold block uppercase">Top Score</span>
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {analyses.length > 0 ? `${Math.max(...analyses.map(a => a.scores.overall))}%` : 'N/A'}
            </span>
          </div>
        </div>

        <div className="glass-card p-6 flex items-center gap-5">
          <div className="h-12 w-12 rounded-xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-500">
            <Search className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold block uppercase">Match Scans</span>
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {analyses.filter(a => a.jobDescription).length}
            </span>
          </div>
        </div>
      </div>

      {/* Main Core Flex Blocks: Upload & Chart panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Upload widget box (col-span-1) */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="glass-panel p-6 rounded-2xl flex flex-col h-full justify-between">
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                Upload Resume
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Drag & drop your file to index semantic embeddings.
              </p>
            </div>

            {/* Drag & drop region */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={triggerUploadClick}
              className={`my-6 border-2 border-dashed rounded-xl p-8 text-center flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                dragActive
                  ? 'border-blue-500 bg-blue-500/5 dark:bg-blue-500/10 scale-[0.98]'
                  : 'border-slate-300 hover:border-blue-500 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-900/30'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.txt,.md"
                className="hidden"
              />
              
              {uploadStatus.loading ? (
                <div className="space-y-3">
                  <Loader2 className="h-10 w-10 text-blue-500 animate-spin mx-auto" />
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Parsing & Indexing...</p>
                  <p className="text-[10px] text-slate-400">Extracting text, generating vectors...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400 dark:text-slate-500 group-hover:text-blue-500 transition-colors">
                    <UploadCloud className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block">Choose file or drag here</span>
                    <span className="text-xs text-slate-400 block mt-1">Supports PDF, TXT, MD up to 5MB</span>
                  </div>
                </div>
              )}
            </div>

            {/* Status alerts */}
            {uploadStatus.success && (
              <div className="p-3.5 rounded-xl bg-emerald-550/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Resume parsed & indexed successfully!</span>
              </div>
            )}
            {uploadStatus.error && (
              <div className="p-3.5 rounded-xl bg-red-550/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{uploadStatus.error}</span>
              </div>
            )}
          </div>
        </div>

        {/* Analytics Graphic Visualizations (col-span-2) */}
        <div className="lg:col-span-2 min-w-0">
          <div className="glass-panel p-6 rounded-2xl h-full flex flex-col justify-between overflow-hidden min-w-0">
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                Strength Analytics
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Visualizing structural scoring of your latest analyzed document.
              </p>
            </div>

            {recentAnalysis ? (
              <div className="flex-grow mt-6 min-h-[260px] w-full">
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.95} />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity={0.65} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3341551A" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} tickLine={false} />
                    <Tooltip
                      cursor={{ fill: 'transparent' }}
                      contentStyle={{
                        background: '#0f172a',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                    />
                    <Bar
                      dataKey="Score"
                      fill="url(#colorScore)"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={45}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center text-center p-8 text-slate-400 dark:text-slate-500">
                <FileText className="h-12 w-12 mb-3 opacity-30 animate-bounce-slow" />
                <p className="text-sm font-semibold">No active analyses found.</p>
                <p className="text-xs mt-1 max-w-[280px]">
                  Upload a resume and click "Analyze" to see detailed strength scores plotted here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Uploaded Resumes lists */}
      <div className="glass-panel p-6 rounded-2xl">
        <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-5">
          Resume Repositories
        </h3>
        
        {loadingResumes ? (
          <div className="py-12 flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
          </div>
        ) : resumes.length === 0 ? (
          <div className="py-12 text-center text-slate-400 dark:text-slate-500">
            <p className="text-sm font-semibold">No resumes uploaded yet.</p>
            <p className="text-xs mt-1">Upload files using the drag-and-drop widget above to start.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/50 dark:border-slate-800/40 text-slate-400 text-xs font-semibold uppercase">
                  <th className="pb-3">Filename</th>
                  <th className="pb-3">Uploaded Date</th>
                  <th className="pb-3">Versions</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-sm">
                {resumes.map((resume) => {
                  const hasAnalyses = analyses.filter(a => a.resume && a.resume._id === resume._id);
                  const latestRep = hasAnalyses[0];
                  
                  return (
                    <tr key={resume._id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                      <td className="py-4 font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-3">
                        <FileText className="h-5 w-5 text-blue-500/80 shrink-0" />
                        <span className="truncate max-w-[200px] sm:max-w-xs">{resume.filename}</span>
                      </td>
                      <td className="py-4 text-slate-500 dark:text-slate-400">
                        {new Date(resume.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          v{resume.versions.length + 1}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-3 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                          {latestRep ? (
                            <button
                              onClick={() => navigate(`/analyses/${latestRep._id}`)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold hover:bg-emerald-500/25 flex items-center gap-1"
                            >
                              Report <ExternalLink className="h-3 w-3" />
                            </button>
                          ) : (
                            <button
                              onClick={() => runAiGrade(resume._id)}
                              disabled={processingState.loading}
                              className="px-3 py-1.5 rounded-lg bg-blue-500 text-white text-xs font-semibold hover:bg-blue-600 transition-colors flex items-center gap-1.5 shadow-sm"
                            >
                              {processingState.loading && processingState.id === resume._id ? (
                                <>
                                  <Loader2 className="h-3 w-3 animate-spin" /> grading
                                </>
                              ) : (
                                <>
                                  Analyze <Sparkles className="h-3 w-3" />
                                </>
                              )}
                            </button>
                          )}
                          
                          <button
                            onClick={() => deleteResume(resume._id)}
                            className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-colors"
                            title="Delete file"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
