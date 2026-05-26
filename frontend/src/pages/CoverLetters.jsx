import React, { useEffect, useState } from 'react';
import { useResumeStore } from '../store/resumeStore';
import { useNavigate } from 'react-router-dom';
import {
  ScrollText,
  FileText,
  Sparkles,
  Loader2,
  Calendar,
  ExternalLink,
  Copy,
  Check,
  X,
  Eye
} from 'lucide-react';

const CoverLetters = () => {
  const { coverLetters, loadingLetters, fetchCoverLetters } = useResumeStore();
  const navigate = useNavigate();

  const [activeLetter, setActiveLetter] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchCoverLetters();
  }, []);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
          Cover Letter Console <ScrollText className="h-7 w-7 text-blue-500" />
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Review and download cover letters generated using Ollama and your resume history.
        </p>
      </div>

      {loadingLetters && coverLetters.length === 0 ? (
        <div className="py-20 flex items-center justify-center">
          <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
        </div>
      ) : coverLetters.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl text-center text-slate-400 dark:text-slate-500 max-w-lg mx-auto">
          <ScrollText className="h-12 w-12 mb-3 opacity-30 mx-auto animate-bounce-slow" />
          <p className="text-sm font-semibold">No cover letters generated yet.</p>
          <p className="text-xs mt-1">
            Analyze your resume and visit the "Cover Letter" tab to generate customized cover letters.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-5 px-4 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs shadow-md transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coverLetters.map((letter) => (
            <div
              key={letter._id}
              className="glass-card p-6 flex flex-col justify-between h-52 hover:shadow-lg cursor-pointer"
              onClick={() => setActiveLetter(letter)}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                    <ScrollText className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(letter.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 truncate pr-6">
                    Cover Letter - {letter.resume?.filename || 'Untitled Resume'}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                    {letter.letterContent}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/40">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveLetter(letter);
                  }}
                  className="flex-grow py-2 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Eye className="h-3.5 w-3.5" /> Inspect Letter
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Inspect popup modal */}
      {activeLetter && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden">
            
            {/* Header */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ScrollText className="h-5 w-5 text-blue-500" />
                <h3 className="font-display font-bold text-slate-900 dark:text-white">
                  Cover Letter Preview
                </h3>
              </div>
              <button
                onClick={() => setActiveLetter(null)}
                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content body */}
            <div className="p-6 flex-1 overflow-y-auto space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/40 pb-3">
                <div className="text-xs text-slate-400">
                  Linked Resume: <strong>{activeLetter.resume?.filename}</strong>
                </div>
                <button
                  onClick={() => handleCopy(activeLetter.letterContent)}
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

              <pre className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-wrap font-sans leading-relaxed bg-slate-50 dark:bg-slate-950/40 p-6 rounded-xl border border-slate-200/50 dark:border-slate-800/40">
                {activeLetter.letterContent}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoverLetters;
