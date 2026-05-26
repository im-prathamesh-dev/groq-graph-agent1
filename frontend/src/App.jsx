import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';

// Import Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ResumeList from './pages/ResumeList';
import JobMatch from './pages/JobMatch';
import AnalysisDetail from './pages/AnalysisDetail';
import CoverLetters from './pages/CoverLetters';
import AdminPanel from './pages/AdminPanel';

// Import Shell
import Layout from './components/Layout';

const App = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Marketing Route */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Secure Protected Workspace Paths */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/resumes" element={<ResumeList />} />
            <Route path="/match" element={<JobMatch />} />
            <Route path="/analyses/:id" element={<AnalysisDetail />} />
            <Route path="/cover-letters" element={<CoverLetters />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Route>

          {/* Redirect catchers */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
