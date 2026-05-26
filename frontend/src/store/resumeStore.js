import { create } from 'zustand';
import { useAuthStore } from './authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper to get authorization headers
const getAuthHeaders = () => {
  const token = useAuthStore.getState().token;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const useResumeStore = create((set, get) => ({
  resumes: [],
  analyses: [],
  coverLetters: [],
  adminStats: null,
  activeAnalysis: null,
  activeCoverLetter: null,
  comparisonResult: null,
  
  loadingResumes: false,
  loadingAnalyses: false,
  loadingLetters: false,
  loadingAdmin: false,
  error: null,

  // Fetch all user resumes
  fetchResumes: async () => {
    set({ loadingResumes: true, error: null });
    try {
      const response = await fetch(`${API_URL}/resumes`, {
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch resumes');
      set({ resumes: data.data, loadingResumes: false });
    } catch (err) {
      set({ error: err.message, loadingResumes: false });
    }
  },

  // Upload a resume file
  uploadResume: async (file) => {
    set({ loadingResumes: true, error: null });
    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await fetch(`${API_URL}/resumes/upload`, {
        method: 'POST',
        headers: getAuthHeaders(), // Multer handles content-type automatically
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Resume upload failed');

      // Refresh list
      await get().fetchResumes();
      set({ loadingResumes: false });
      return data.data;
    } catch (err) {
      set({ error: err.message, loadingResumes: false });
      return null;
    }
  },

  // Delete a resume
  deleteResume: async (id) => {
    set({ loadingResumes: true, error: null });
    try {
      const response = await fetch(`${API_URL}/resumes/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to delete resume');

      // Filter local state
      set(state => ({
        resumes: state.resumes.filter(r => r._id !== id),
        loadingResumes: false,
      }));
      return true;
    } catch (err) {
      set({ error: err.message, loadingResumes: false });
      return false;
    }
  },

  // Fetch analysis histories
  fetchAnalyses: async () => {
    set({ loadingAnalyses: true, error: null });
    try {
      const response = await fetch(`${API_URL}/analyses`, {
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch analysis records');
      set({ analyses: data.data, loadingAnalyses: false });
    } catch (err) {
      set({ error: err.message, loadingAnalyses: false });
    }
  },

  // Fetch individual analysis by ID
  fetchAnalysisById: async (id) => {
    set({ loadingAnalyses: true, activeAnalysis: null, error: null });
    try {
      const response = await fetch(`${API_URL}/analyses/${id}`, {
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch analysis details');
      set({ activeAnalysis: data.data, loadingAnalyses: false });
      return data.data;
    } catch (err) {
      set({ error: err.message, loadingAnalyses: false });
      return null;
    }
  },

  // Run AI RAG Analysis
  analyzeResume: async (resumeId, jobDescription = '') => {
    set({ loadingAnalyses: true, error: null });
    try {
      const response = await fetch(`${API_URL}/analyses/analyze/${resumeId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ jobDescription }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to run AI RAG analysis');
      
      set({ activeAnalysis: data.data, loadingAnalyses: false });
      await get().fetchAnalyses(); // refresh history list
      return data.data;
    } catch (err) {
      set({ error: err.message, loadingAnalyses: false });
      return null;
    }
  },

  // Compare active resume vs a historical version
  compareVersions: async (resumeId, versionId) => {
    set({ loadingResumes: true, comparisonResult: null, error: null });
    try {
      const response = await fetch(`${API_URL}/analyses/compare/${resumeId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ versionId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to compare resume versions');
      
      set({ comparisonResult: data.data, loadingResumes: false });
      return data.data;
    } catch (err) {
      set({ error: err.message, loadingResumes: false });
      return null;
    }
  },

  // Fetch generated cover letters list
  fetchCoverLetters: async () => {
    set({ loadingLetters: true, error: null });
    try {
      const response = await fetch(`${API_URL}/cover-letters`, {
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch cover letters');
      set({ coverLetters: data.data, loadingLetters: false });
    } catch (err) {
      set({ error: err.message, loadingLetters: false });
    }
  },

  // Generate new cover letter
  generateCoverLetter: async (resumeId, jobDescription) => {
    set({ loadingLetters: true, error: null });
    try {
      const response = await fetch(`${API_URL}/cover-letters/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ resumeId, jobDescription }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Cover letter generation failed');
      
      set({ activeCoverLetter: data.data, loadingLetters: false });
      await get().fetchCoverLetters(); // refresh history
      return data.data;
    } catch (err) {
      set({ error: err.message, loadingLetters: false });
      return null;
    }
  },

  // Fetch admin usage analytics
  fetchAdminStats: async () => {
    set({ loadingAdmin: true, error: null });
    try {
      const response = await fetch(`${API_URL}/admin/stats`, {
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Access denied / stats fetch failed');
      set({ adminStats: data.data, loadingAdmin: false });
    } catch (err) {
      set({ error: err.message, loadingAdmin: false });
    }
  },

  clearError: () => set({ error: null }),
  clearComparison: () => set({ comparisonResult: null }),
}));
