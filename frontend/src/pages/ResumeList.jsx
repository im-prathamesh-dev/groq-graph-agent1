import React, { useEffect, useState } from 'react';
import { useResumeStore } from '../store/resumeStore';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  History,
  Trash2,
  GitCompare,
  ArrowLeftRight,
  Plus,
  Loader2,
  Calendar,
  X,
  Sparkles,
  ChevronDown
} from 'lucide-react';

const ResumeList = () => {
  const {
    resumes,
    loadingResumes,
    fetchResumes,
    deleteResume,
    compareVersions,
    comparisonResult,
    clearComparison
  } = useResumeStore();

  const navigate = useNavigate();
  const [selectedResume, setSelectedResume] = useState(null);
  const [selectedVersionId, setSelectedVersionId] = useState('');
  const [comparingState, setComparingState] = useState(false);

  useEffect(() => {
    fetchResumes();
    clearComparison();
  }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this resume and all its vector indices?')) {
      await deleteResume(id);
    }
  };

  const handleCompareClick = (resume) => {
    setSelectedResume(resume);
    setSelectedVersionId('');
    clearComparison();
  };

  const triggerComparison = async () => {
    if (!selectedResume || !selectedVersionId) return;
    setComparingState(true);
    await compareVersions(selectedResume._id, selectedVersionId);
    setComparingState(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">
          Resume Repository
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Review and audit historical revisions, upload updates, and review changes.
        </p>
      </div>

      {/* Main Grid View */}
      {loadingResumes && resumes.length === 0 ? (
        <div className="py-20 flex items-center justify-center">
          <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
        </div>
      ) : resumes.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl text-center text-slate-400 dark:text-slate-500 max-w-lg mx-auto">
          <FileText className="h-12 w-12 mb-3 opacity-30 mx-auto" />
          <p className="text-sm font-semibold">No resumes stored yet.</p>
          <p className="text-xs mt-1">Head over to the Dashboard to upload your first resume!</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-5 px-4 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs shadow-md transition-colors"
          >
            Go to Uploader
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume) => (
            <div
              key={resume._id}
              className="glass-card p-6 flex flex-col justify-between h-56 hover:shadow-lg relative group cursor-pointer"
              onClick={() => navigate('/dashboard')}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                    <FileText className="h-5 w-5" />
                  </div>
                  
                  {/* Version tag */}
                  <span className="text-[10px] bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/40 px-2 py-0.5 rounded-full font-bold">
                    Active: v{resume.versions.length + 1}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 truncate pr-6" title={resume.filename}>
                    {resume.filename}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Uploaded {new Date(resume.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/40">
                {resume.versions.length > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCompareClick(resume);
                    }}
                    className="flex-1 py-2 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <GitCompare className="h-3.5 w-3.5 text-slate-400" /> Compare History
                  </button>
                )}

                <button
                  onClick={(e) => handleDelete(e, resume._id)}
                  className="p-2 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-colors ml-auto"
                  title="Delete resume repository"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Comparisons diff popup modal overlay */}
      {selectedResume && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GitCompare className="h-5 w-5 text-blue-500" />
                <h3 className="font-display font-bold text-slate-900 dark:text-white">
                  Resume Delta comparison
                </h3>
              </div>
              <button
                onClick={() => setSelectedResume(null)}
                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 flex-1 overflow-y-auto space-y-6">
              <div className="rounded-xl bg-slate-50 dark:bg-slate-950 p-4 border border-slate-200/40 dark:border-slate-800/40 space-y-4">
                <p className="text-xs text-slate-500">
                  Select a historical version of <strong>{selectedResume.filename}</strong> to view changes against the current active layout (v{selectedResume.versions.length + 1}).
                </p>
                
                {/* Select Version Dropdown */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <select
                      value={selectedVersionId}
                      onChange={(e) => setSelectedVersionId(e.target.value)}
                      className="w-full appearance-none pl-4 pr-10 py-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800/60 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-xs"
                    >
                      <option value="">-- Choose Historical Version --</option>
                      {selectedResume.versions.map((ver, idx) => (
                        <option key={ver._id} value={ver._id}>
                          Version {idx + 1} (Uploaded: {new Date(ver.uploadDate).toLocaleString()})
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="h-4 w-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                  </div>

                  <button
                    onClick={triggerComparison}
                    disabled={!selectedVersionId || comparingState}
                    className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5"
                  >
                    {comparingState ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" /> auditing...
                      </>
                    ) : (
                      <>
                        Analyze Diff <ArrowLeftRight className="h-3.5 w-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Comparison Statistics display */}
              {comparisonResult && (
                <div className="space-y-6">
                  {/* Grid summary */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-200/50 dark:border-slate-800/40">
                      <span className="text-[10px] text-slate-400 block font-semibold uppercase">Active Words</span>
                      <span className="text-lg font-bold text-slate-800 dark:text-slate-100">{comparisonResult.active.wordCount}</span>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-200/50 dark:border-slate-800/40">
                      <span className="text-[10px] text-slate-400 block font-semibold uppercase">Delta Additions</span>
                      <span className="text-lg font-bold text-emerald-500">+{comparisonResult.diffSummary.addedLinesCount} lines</span>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-200/50 dark:border-slate-800/40">
                      <span className="text-[10px] text-slate-400 block font-semibold uppercase">Delta Deletions</span>
                      <span className="text-lg font-bold text-red-500">-{comparisonResult.diffSummary.removedLinesCount} lines</span>
                    </div>
                  </div>

                  {/* Highlights section */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200 border-l-2 border-blue-500 pl-2">
                      Semantic Delta Additions (New Content)
                    </h4>
                    {comparisonResult.diffSummary.addedSamples.length > 0 ? (
                      <div className="space-y-2.5">
                        {comparisonResult.diffSummary.addedSamples.map((samp, idx) => (
                          <div key={idx} className="p-3 bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-200/40 dark:border-emerald-900/30 rounded-lg text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                            + {samp}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No brand new content block paragraphs detected.</p>
                    )}

                    <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200 border-l-2 border-red-500 pl-2 pt-2">
                      Removed / Restructured Details
                    </h4>
                    {comparisonResult.diffSummary.removedSamples.length > 0 ? (
                      <div className="space-y-2.5">
                        {comparisonResult.diffSummary.removedSamples.map((samp, idx) => (
                          <div key={idx} className="p-3 bg-red-555/5 dark:bg-red-950/10 border border-red-200/40 dark:border-red-900/30 rounded-lg text-xs text-red-700 dark:text-red-300 font-medium line-through">
                            - {samp}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No deleted paragraphs found.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeList;
