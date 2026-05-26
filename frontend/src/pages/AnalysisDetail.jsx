import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useResumeStore } from '../store/resumeStore';
import {
  Award,
  CheckCircle2,
  XCircle,
  FileCheck,
  Zap,
  Download,
  ArrowLeft,
  Loader2,
  ScrollText,
  Copy,
  Check,
  BrainCircuit,
  MessageSquareQuote
} from 'lucide-react';

const AnalysisDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    activeAnalysis,
    loadingAnalyses,
    fetchAnalysisById,
    generateCoverLetter,
    loadingLetters
  } = useResumeStore();

  const [coverLetterText, setCoverLetterText] = useState('');
  const [copied, setCopied] = useState(false);
  const [jdText, setJdText] = useState('');
  const [activeTab, setActiveTab] = useState('overview'); // overview, suggestions, cover-letter

  useEffect(() => {
    fetchAnalysisById(id);
  }, [id]);

  if (loadingAnalyses && !activeAnalysis) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
        <p className="text-sm font-semibold text-slate-500">Retrieving AI Audit...</p>
      </div>
    );
  }

  if (!activeAnalysis) {
    return (
      <div className="py-20 text-center space-y-4 max-w-sm mx-auto">
        <p className="text-sm font-semibold text-slate-500">Analysis report not found.</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2 bg-blue-500 text-white text-xs font-bold rounded-lg"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    // Opens the backend export report route in a new window which has auto print trigger
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const token = localStorage.getItem('token');
    // Open in new tab appending authorization token in path parameters or we can do window.open
    // For local ease, we can open the print URL directly or use print in current page.
    window.open(`${API_URL}/analyses/export/${id}?token=${token}`, '_blank');
  };

  const handleCreateCoverLetter = async () => {
    if (!jdText) return;
    const letter = await generateCoverLetter(activeAnalysis.resume._id, jdText);
    if (letter) {
      setCoverLetterText(letter.letterContent);
    }
  };

  const handleCopyLetter = () => {
    navigator.clipboard.writeText(coverLetterText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </button>

        <button
          onClick={handlePrint}
          className="px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5 self-start"
        >
          <Download className="h-4 w-4" /> Export Report / Save PDF
        </button>
      </div>

      {/* Profile info block */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Analyzed Document</span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 mt-0.5">
            {activeAnalysis.resume.filename}
          </h2>
        </div>
        <div className="text-xs text-slate-400">
          Scanned Date: {new Date(activeAnalysis.createdAt).toLocaleString()}
        </div>
      </div>

      {/* Dynamic Tab Toggles */}
      <div className="flex border-b border-slate-200 dark:border-slate-800/40 gap-6">
        {['overview', 'suggestions', 'cover-letter'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3.5 text-sm font-semibold capitalize relative transition-colors ${
              activeTab === tab
                ? 'text-blue-500 dark:text-blue-400'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {tab.replace('-', ' ')}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 dark:bg-blue-400 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab content viewports */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          
          {/* Circular Score cards grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: 'Overall Score', score: activeAnalysis.scores.overall },
              { name: 'ATS Grader', score: activeAnalysis.scores.ats },
              { name: 'Skills Level', score: activeAnalysis.scores.skills },
              { name: 'Experience', score: activeAnalysis.scores.experience },
              { name: 'Readability', score: activeAnalysis.scores.readability },
              { name: 'Formatting', score: activeAnalysis.scores.formatting },
            ].map((card, idx) => (
              <div key={idx} className="glass-card p-5 text-center flex flex-col justify-between items-center h-40">
                <span className="text-[10px] text-slate-400 font-bold uppercase">{card.name}</span>
                <div className="relative h-20 w-20 flex items-center justify-center mt-2">
                  {/* Gauge Ring */}
                  <svg className="absolute transform -rotate-90 w-full h-full" viewBox="0 0 36 36">
                    <path
                      className="text-slate-100 dark:text-slate-800"
                      strokeWidth="3"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-blue-500 dark:text-blue-400"
                      strokeWidth="3"
                      strokeDasharray={`${card.score}, 100`}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="text-lg font-extrabold text-slate-800 dark:text-slate-100">{card.score}%</span>
                </div>
              </div>
            ))}
          </div>

          {/* Strengths vs Weaknesses columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <h3 className="font-display font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/40 pb-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" /> Key Technical Strengths
              </h3>
              <ul className="space-y-3">
                {activeAnalysis.details.strengths.map((str, idx) => (
                  <li key={idx} className="text-sm text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <h3 className="font-display font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/40 pb-3">
                <XCircle className="h-5 w-5 text-red-500" /> Improvement Gaps
              </h3>
              <ul className="space-y-3">
                {activeAnalysis.details.weaknesses.map((weak, idx) => (
                  <li key={idx} className="text-sm text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                    <span>{weak}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Keyword and GAP Analyzer */}
          <div className="glass-panel p-6 rounded-2xl space-y-5">
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                Skill Gap Analyzer
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Visualizing target skills matched versus technical missing capabilities.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-xs text-slate-400 font-semibold uppercase mb-2">Matched Competencies</h4>
                <div className="flex flex-wrap gap-2">
                  {activeAnalysis.details.skillsFound.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/30 rounded-lg text-xs font-semibold">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <h4 className="text-xs text-slate-400 font-semibold uppercase mb-2">Suggested / Missing Keywords</h4>
                <div className="flex flex-wrap gap-2">
                  {activeAnalysis.details.skillsMissing.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-200/50 dark:border-red-900/30 rounded-lg text-xs font-semibold">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'suggestions' && (
        <div className="space-y-8">
          
          {/* Summary Refactoring */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/40 pb-3">
              <Zap className="h-5 w-5 text-yellow-500" /> AI Optimized Summary
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950/40 p-4 border border-dashed border-slate-200 dark:border-slate-800/60 rounded-xl font-medium italic">
              "{activeAnalysis.suggestions.improvedSummary}"
            </p>
          </div>

          {/* Project enhancements list */}
          <div className="glass-panel p-6 rounded-2xl space-y-5">
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <BrainCircuit className="h-5 w-5 text-blue-500" /> Project Description Refactoring
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Optimizing bullet items using active language verbs and quantitative KPI impacts.
              </p>
            </div>

            <div className="space-y-6">
              {activeAnalysis.suggestions.improvedProjects.map((proj, idx) => (
                <div key={idx} className="p-5 border border-slate-200/50 dark:border-slate-800/40 rounded-xl bg-slate-50/50 dark:bg-slate-950/20 space-y-4">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Original Bullet</span>
                    <p className="text-xs text-slate-500 mt-1">{proj.original}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-500 block font-semibold uppercase">AI Improved Output</span>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 mt-1">{proj.improved}</p>
                  </div>
                  <div className="text-[10px] text-slate-400 border-t border-slate-100 dark:border-slate-800/30 pt-2.5">
                    <strong>Feedback rationale:</strong> {proj.rationale}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Prep Framework lists */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h3 className="font-display font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/40 pb-3">
              <MessageSquareQuote className="h-5 w-5 text-purple-500" /> Suggested Interview Preparation Topics
            </h3>
            <ul className="space-y-3">
              {activeAnalysis.suggestions.interviewPrep.map((prep, idx) => (
                <li key={idx} className="text-sm text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
                  <span className="h-2 w-2 bg-purple-500 rounded-full mt-2 shrink-0" />
                  <span>{prep}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'cover-letter' && (
        <div className="glass-panel p-6 rounded-2xl space-y-6">
          <div>
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <ScrollText className="h-5 w-5 text-blue-500" /> AI Cover Letter Generator
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Provide a job description to draft an aligned, customized cover letter.
            </p>
          </div>

          {/* Prompt Box */}
          <div className="space-y-4">
            <textarea
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Paste target job requirements and company details here..."
              rows={5}
              className="w-full px-4 py-3 rounded-xl border border-slate-200/80 dark:border-slate-800/60 bg-white/50 dark:bg-slate-950/40 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-xs leading-relaxed"
            />
            
            <button
              onClick={handleCreateCoverLetter}
              disabled={!jdText || loadingLetters}
              className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5"
            >
              {loadingLetters ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Drafting letter...
                </>
              ) : (
                <>
                  Generate Cover Letter <Zap className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </div>

          {/* Letter Output Panel */}
          {coverLetterText && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/40 pb-3">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Generated Document</span>
                <button
                  onClick={handleCopyLetter}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-green-500" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-slate-400" /> Copy Text
                    </>
                  )}
                </button>
              </div>
              
              <pre className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-wrap font-sans leading-relaxed bg-slate-50 dark:bg-slate-950/40 p-6 rounded-xl border border-slate-200/50 dark:border-slate-800/40 max-h-[500px] overflow-y-auto">
                {coverLetterText}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnalysisDetail;
