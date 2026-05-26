import React, { useEffect, useState } from 'react';
import { useResumeStore } from '../store/resumeStore';
import { useNavigate } from 'react-router-dom';
import {
  ScanEye,
  FileText,
  Sparkles,
  Loader2,
  AlertCircle,
  TrendingUp,
  XCircle,
  CheckCircle2,
  Zap,
  ArrowRight
} from 'lucide-react';

const JobMatch = () => {
  const { resumes, loadingResumes, fetchResumes, analyzeResume, loadingAnalyses, error, clearError } = useResumeStore();
  const navigate = useNavigate();

  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [activeResult, setActiveResult] = useState(null);

  useEffect(() => {
    fetchResumes();
    clearError();
  }, []);

  const handleMatch = async (e) => {
    e.preventDefault();
    if (!selectedResumeId || !jobDescription) return;
    
    const result = await analyzeResume(selectedResumeId, jobDescription);
    if (result) {
      setActiveResult(result);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
          Job Description Matching <ScanEye className="h-7 w-7 text-blue-500" />
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Perform a semantic similarity audit of your resume against target company job descriptions.
        </p>
      </div>

      {/* Grid: Main input form & result rendering */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Input box (col-span-2) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-2xl space-y-5">
            <h3 className="font-display font-bold text-slate-900 dark:text-white">
              Target Screening Details
            </h3>

            {error && (
              <div className="p-3.5 rounded-xl bg-red-550/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleMatch} className="space-y-5">
              {/* Select Resume Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Select Resume Version
                </label>
                {loadingResumes ? (
                  <div className="py-2 flex items-center gap-2">
                    <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                    <span className="text-xs text-slate-400">Loading stored files...</span>
                  </div>
                ) : resumes.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No files stored. Upload a resume first.</p>
                ) : (
                  <select
                    required
                    value={selectedResumeId}
                    onChange={(e) => setSelectedResumeId(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-200/80 dark:border-slate-800/60 bg-white/50 dark:bg-slate-950/40 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm appearance-none"
                  >
                    <option value="">-- Choose Resume --</option>
                    {resumes.map((resume) => (
                      <option key={resume._id} value={resume._id}>
                        {resume.filename} (v{resume.versions.length + 1})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Paste Job Description TextArea */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Target Job Requirements
                </label>
                <textarea
                  required
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description or primary tech stack requirements here..."
                  rows={8}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200/80 dark:border-slate-800/60 bg-white/50 dark:bg-slate-950/40 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-xs leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={!selectedResumeId || !jobDescription || loadingAnalyses}
                className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-blue-500/10 transition-all duration-200 flex items-center justify-center gap-2 group"
              >
                {loadingAnalyses ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Cross Auditing RAG...
                  </>
                ) : (
                  <>
                    Calculate Semantic Match <Sparkles className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Results layout (col-span-3) */}
        <div className="lg:col-span-3">
          {activeResult ? (
            <div className="space-y-6">
              
              {/* Overall Score Circle */}
              <div className="glass-panel p-6 rounded-2xl flex items-center gap-6 justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Semantic Similarity</span>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">Role Match Grading</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[280px]">
                    Semantic scoring reflects tech overlays, experience ranges, and key bullet metrics.
                  </p>
                </div>
                
                <div className="relative h-28 w-28 flex items-center justify-center shrink-0">
                  <svg className="absolute transform -rotate-90 w-full h-full" viewBox="0 0 36 36">
                    <path
                      className="text-slate-100 dark:text-slate-800"
                      strokeWidth="3"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-indigo-500"
                      strokeWidth="3"
                      strokeDasharray={`${activeResult.scores.overall}, 100`}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{activeResult.scores.overall}%</span>
                </div>
              </div>

              {/* Matched vs Missing details */}
              <div className="glass-panel p-6 rounded-2xl space-y-4">
                <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200 border-l-2 border-indigo-500 pl-2">
                  Matched Skills (Green) & Missing Competencies (Red)
                </h4>
                <div className="space-y-3 pt-2">
                  <div className="flex flex-wrap gap-1.5">
                    {activeResult.details.skillsFound.map((sk, idx) => (
                      <span key={idx} className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/40 text-emerald-600 dark:text-emerald-400">
                        {sk}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {activeResult.details.skillsMissing.map((sk, idx) => (
                      <span key={idx} className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-800/40 text-red-600 dark:text-red-400">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-5 border border-emerald-200/30 bg-emerald-50/50 dark:bg-emerald-950/5 rounded-xl space-y-3">
                  <h4 className="font-bold text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                    <CheckCircle2 className="h-4 w-4" /> Aligned Strengths
                  </h4>
                  <ul className="space-y-2">
                    {activeResult.details.strengths.slice(0, 3).map((st, idx) => (
                      <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        &bull; {st}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-5 border border-red-200/30 bg-red-50/50 dark:bg-red-950/5 rounded-xl space-y-3">
                  <h4 className="font-bold text-xs text-red-500 flex items-center gap-1.5 uppercase tracking-wider">
                    <XCircle className="h-4 w-4" /> Matching Gaps
                  </h4>
                  <ul className="space-y-2">
                    {activeResult.details.weaknesses.slice(0, 3).map((wk, idx) => (
                      <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        &bull; {wk}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Optimization Action plan */}
              <div className="glass-panel p-6 rounded-2xl space-y-4">
                <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500 fill-yellow-500" /> Recommended tailored adjustments
                </h4>
                <ul className="space-y-2.5">
                  {activeResult.suggestions.keywordsToSuggest.map((rec, idx) => (
                    <li key={idx} className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      &bull; {rec}
                    </li>
                  ))}
                </ul>
                <div className="pt-2">
                  <button
                    onClick={() => navigate(`/analyses/${activeResult._id}`)}
                    className="px-4 py-2 rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold shadow-sm hover:opacity-90 transition-all flex items-center gap-1.5"
                  >
                    View Comprehensive AI grading <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="glass-panel p-12 rounded-2xl text-center text-slate-400 dark:text-slate-500 h-full flex flex-col items-center justify-center min-h-[300px]">
              <ScanEye className="h-14 w-14 mb-4 text-slate-300 dark:text-slate-600 animate-pulse-slow" />
              <p className="text-sm font-semibold">Ready for Semantic Matching.</p>
              <p className="text-xs mt-1 max-w-[340px]">
                Choose a resume repository, paste the company job requirements, and run the matching grader.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default JobMatch;
