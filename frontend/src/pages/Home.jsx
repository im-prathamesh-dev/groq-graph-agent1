import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Zap,
  Target,
  FileCheck,
  TrendingUp,
  Brain,
  ShieldCheck,
  ArrowRight,
  Github,
  Linkedin,
  Youtube,
  Instagram
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Home = () => {
  const { token } = useAuthStore();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
  };

  const features = [
    {
      title: 'LangChain JS RAG Pipeline',
      description: 'Splits, embeds, and indexes your resume into Qdrant for granular, context-aware AI querying.',
      icon: Brain,
      color: 'from-blue-500 to-indigo-500',
    },
    {
      title: 'Deep ATS Audit Grader',
      description: 'Scores structural margins, fonts, readability densities, and matches missing core keywords.',
      icon: Target,
      color: 'from-indigo-500 to-purple-500',
    },
    {
      title: 'Interactive Gap Charts',
      description: 'Generates detailed radar & bar charts highlighting exactly where you stand against candidates.',
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Historical Revision Comparison',
      description: 'Tracks revisions. Compare multiple resume versions side-by-side to track score increases.',
      icon: FileCheck,
      color: 'from-emerald-500 to-teal-500',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden radial-glow-blue grid-bg-overlay">
      
      {/* Decorative ambient glowing grids */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Top Header Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Sparkles className="h-5 w-5 animate-spin-slow" />
          </div>
          <span className="font-display font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-300">
            ResuMind AI
          </span>
        </div>
        <div className="flex items-center gap-4">
          {token ? (
            <Link
              to="/dashboard"
              className="px-5 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 font-semibold text-sm transition-all duration-200 shadow-md flex items-center gap-2"
            >
              Go to Workspace <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm transition-all duration-200 shadow-md shadow-blue-600/10"
              >
                Get Started Free
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section Container */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-24 text-center relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50/80 border border-blue-200 dark:bg-blue-950/40 dark:border-blue-900/30 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-8"
        >
          <Zap className="h-3.5 w-3.5 fill-blue-500" /> Powered by LangChain, Qdrant & Local Ollama
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display font-extrabold text-5xl md:text-7xl leading-tight text-slate-900 dark:text-white max-w-4xl tracking-tight"
        >
          Optimize Your Resume for ATS with{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 animate-gradient-bg">
            Contextual AI RAG
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-slate-500 dark:text-slate-400 text-lg md:text-xl mt-6 max-w-2xl leading-relaxed"
        >
          Upload your resume, paste target job descriptions, and let our semantic local LLM pipeline scan for skill gaps, formatting flows, and write matching cover letters.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4"
        >
          <Link
            to={token ? '/dashboard' : '/register'}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-bold text-base transition-all duration-200 shadow-xl shadow-blue-500/20 flex items-center gap-2 group"
          >
            Start Analyzing Resume <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
          <a
            href="#features"
            className="px-8 py-4 rounded-xl bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 text-base transition-all duration-200"
          >
            Explore Tech Stack
          </a>
        </motion.div>

        {/* Dashboard Preview mockup image */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, type: 'spring', stiffness: 50 }}
          className="mt-20 w-full max-w-5xl rounded-2xl border border-slate-200/50 dark:border-slate-800/40 p-2.5 bg-slate-200/30 dark:bg-slate-900/30 backdrop-blur-md shadow-2xl relative"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-transparent rounded-2xl pointer-events-none" />
          <div className="rounded-xl overflow-hidden bg-slate-900 border border-slate-800 h-[380px] flex flex-col">
            {/* Window control details */}
            <div className="px-4 py-3 bg-slate-950 border-b border-slate-900 flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <div className="h-3 w-3 rounded-full bg-yellow-500" />
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <div className="text-[10px] text-slate-500 font-medium mx-auto">https://resumind.ai/dashboard</div>
            </div>
            
            {/* Visual landing frame placeholders */}
            <div className="flex-1 p-6 grid grid-cols-3 gap-6 text-left">
              <div className="col-span-1 border border-slate-800 rounded-xl p-5 space-y-4 bg-slate-950/50">
                <div className="h-4 w-1/3 bg-slate-800 rounded animate-pulse" />
                <div className="h-24 w-24 rounded-full border-4 border-slate-800 flex items-center justify-center text-slate-400 font-extrabold text-2xl mx-auto">
                  85%
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-slate-800 rounded w-full animate-pulse" />
                  <div className="h-3 bg-slate-800 rounded w-5/6 animate-pulse" />
                </div>
              </div>
              <div className="col-span-2 border border-slate-800 rounded-xl p-5 space-y-5 bg-slate-950/50">
                <div className="h-4 w-1/4 bg-slate-800 rounded animate-pulse" />
                <div className="space-y-3">
                  <div className="h-10 bg-slate-900 border border-slate-800 rounded-lg flex items-center px-4 justify-between">
                    <div className="h-3 w-1/2 bg-slate-800 rounded" />
                    <div className="h-5 w-12 bg-green-950 text-green-400 rounded-full" />
                  </div>
                  <div className="h-10 bg-slate-900 border border-slate-800 rounded-lg flex items-center px-4 justify-between">
                    <div className="h-3 w-1/3 bg-slate-800 rounded" />
                    <div className="h-5 w-12 bg-red-950 text-red-400 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Feature Grids Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24 relative z-10 border-t border-slate-200/50 dark:border-slate-800/40">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-slate-900 dark:text-white">
            Comprehensive Analysis Architecture
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-4">
            Leveraging local, privacy-centric large language processing frameworks to ensure complete resume confidentiality.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="glass-card p-6 flex flex-col gap-4 relative group"
            >
              <div className={`h-12 w-12 rounded-xl bg-gradient-to-tr ${feat.color} flex items-center justify-center text-white shadow-md`}>
                <feat.icon className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mt-2">
                {feat.title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {feat.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Trust Shield Banner */}
      <section className="bg-slate-100/60 dark:bg-slate-900/40 py-16 px-6 relative z-10 border-t border-slate-200/30 dark:border-slate-800/20 text-center">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-white">
            100% Privacy Compliant & Locally Engineered
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl">
            Because all LLM analyses are hosted locally on your device via Ollama, none of your sensitive personal data or project histories are uploaded to cloud servers.
          </p>
        </div>
      </section>

      {/* Premium Sheryians Coding School Inspired Footer */}
      <footer className="w-full bg-slate-950 text-slate-400 border-t border-slate-900/50 pt-16 pb-8 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="font-display font-extrabold text-xl tracking-tight text-white">
                ResuMind AI
              </span>
            </div>
            <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
              ResuMind AI is a state-of-the-art developer workspace designed to optimize resumes locally, ensuring 100% data confidentiality while analyzing skills against modern corporate ATS metrics.
            </p>
            {/* Social badges with scale animation */}
            <div className="flex items-center gap-3 pt-2">
              {[
                { icon: Github, link: 'https://github.com', color: 'hover:text-white hover:bg-slate-800' },
                { icon: Linkedin, link: 'https://linkedin.com', color: 'hover:text-blue-400 hover:bg-blue-900/20' },
                { icon: Instagram, link: 'https://instagram.com', color: 'hover:text-pink-400 hover:bg-pink-900/20' },
                { icon: Youtube, link: 'https://youtube.com', color: 'hover:text-red-500 hover:bg-red-950/20' }
              ].map((soc, idx) => (
                <a
                  key={idx}
                  href={soc.link}
                  target="_blank"
                  rel="noreferrer"
                  className={`h-9 w-9 rounded-lg border border-slate-800/80 flex items-center justify-center text-slate-500 transition-all duration-300 hover:scale-115 ${soc.color}`}
                >
                  <soc.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links columns */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Core Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { name: 'AI Dashboard', path: '/dashboard' },
                { name: 'ATS Optimizer', path: '/dashboard' },
                { name: 'Semantic Search', path: '/match' },
                { name: 'Cover Letters', path: '/cover-letters' }
              ].map((item, idx) => (
                <li key={idx}>
                  <Link
                    to={item.path}
                    className="hover:text-white transition-colors duration-200 block"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Technical Resources
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { name: 'LangChain JS Docs', link: 'https://js.langchain.com' },
                { name: 'Qdrant Vector DB', link: 'https://qdrant.tech' },
                { name: 'Ollama Models', link: 'https://ollama.com' },
                { name: 'MERN Boilerplate', link: 'https://github.com' }
              ].map((item, idx) => (
                <li key={idx}>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition-colors duration-200 block"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Local Policy
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { name: 'Privacy Guidelines' },
                { name: 'MERN Security' },
                { name: 'Vector Encryption' },
                { name: 'Client Sandbox' }
              ].map((item, idx) => (
                <li key={idx} className="hover:text-white cursor-pointer transition-colors duration-200 block">
                  {item.name}
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Lower Horizontal Copyright row */}
        <div className="max-w-7xl mx-auto px-6 border-t border-slate-900/60 mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div>
            &copy; {new Date().getFullYear()} ResuMind AI. All rights reserved. Open-source MERN pipeline distribution.
          </div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Designed with ❤️ locally for Developers & Bootcamps</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
