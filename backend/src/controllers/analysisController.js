import Resume from '../models/Resume.js';
import Analysis from '../models/Analysis.js';
import { querySemanticContext } from '../services/ragService.js';
import { analyzeResume, matchJobDescription } from '../services/aiService.js';

/**
 * @desc    Analyze a resume using RAG + LLM
 * @route   POST /api/analyses/analyze/:resumeId
 * @access  Private
 */
export const analyzeUserResume = async (req, res, next) => {
  try {
    const { resumeId } = req.params;
    const { jobDescription } = req.body; // optional job description

    // 1. Fetch Resume
    const resume = await Resume.findOne({ _id: resumeId, user: req.user._id });
    if (!resume) {
      res.status(404);
      throw new Error('Resume not found or unauthorized');
    }

    console.log(`[Analysis Controller] Triggering AI RAG Analysis for Resume: ${resume.filename}`);

    // 2. Query Qdrant for semantic context (Retrieval step in RAG)
    // We search the vector space using key terms like "skills", "experience", "education"
    const searchTopic = jobDescription ? `skills, experience, and keywords required for: ${jobDescription}` : 'skills, experience, education, work projects, certifications';
    const ragContext = await querySemanticContext(resumeId, searchTopic, 5);

    // 3. Trigger LLM Analysis with RAG Context
    let analysisResult;
    if (jobDescription) {
      // Perform Job Match Analysis
      const matchResult = await matchJobDescription(resume.parsedText, jobDescription);
      
      // We also run a general analysis to merge scores and suggestions
      const genAnalysis = await analyzeResume(resume.parsedText, ragContext);
      
      // Combine results for a comprehensive record
      analysisResult = {
        scores: {
          overall: matchResult.matchPercentage,
          ats: Math.round((matchResult.scores.overall + genAnalysis.scores.ats) / 2),
          skills: matchResult.scores.skillsMatch,
          experience: matchResult.scores.experienceMatch,
          formatting: genAnalysis.scores.formatting,
          readability: genAnalysis.scores.readability,
        },
        details: {
          skillsFound: matchResult.matchedSkills,
          skillsMissing: matchResult.missingSkills,
          softSkills: genAnalysis.details.softSkills,
          keywordDensity: genAnalysis.details.keywordDensity,
          formattingIssues: genAnalysis.details.formattingIssues,
          strengths: matchResult.strengths,
          weaknesses: matchResult.weaknesses,
        },
        suggestions: {
          improvedSummary: genAnalysis.suggestions.improvedSummary,
          improvedProjects: genAnalysis.suggestions.improvedProjects,
          keywordsToSuggest: matchResult.recommendations,
          skillsToLearn: genAnalysis.suggestions.skillsToLearn,
          interviewPrep: genAnalysis.suggestions.interviewPrep,
        }
      };
    } else {
      // General Analysis only
      analysisResult = await analyzeResume(resume.parsedText, ragContext);
    }

    // 4. Save analysis to MongoDB
    const analysis = await Analysis.create({
      resume: resumeId,
      user: req.user._id,
      jobDescription: jobDescription || '',
      scores: analysisResult.scores,
      details: analysisResult.details,
      suggestions: analysisResult.suggestions,
    });

    res.status(201).json({
      success: true,
      message: 'Resume analysis completed successfully',
      data: analysis,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all analyses of logged in user
 * @route   GET /api/analyses
 * @access  Private
 */
export const getMyAnalyses = async (req, res, next) => {
  try {
    const analyses = await Analysis.find({ user: req.user._id })
      .populate('resume', 'filename')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: analyses,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single analysis details
 * @route   GET /api/analyses/:id
 * @access  Private
 */
export const getAnalysisById = async (req, res, next) => {
  try {
    const analysis = await Analysis.findOne({ _id: req.params.id, user: req.user._id })
      .populate('resume', 'filename createdAt');
      
    if (!analysis) {
      res.status(404);
      throw new Error('Analysis report not found or unauthorized');
    }

    res.json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Compare active resume version vs a historical version
 * @route   POST /api/analyses/compare/:resumeId
 * @access  Private
 */
export const compareResumeVersions = async (req, res, next) => {
  try {
    const { resumeId } = req.params;
    const { versionId } = req.body; // historical version id

    const resume = await Resume.findOne({ _id: resumeId, user: req.user._id });
    if (!resume) {
      res.status(404);
      throw new Error('Resume not found');
    }

    const activeText = resume.parsedText;
    
    // Find version
    const historicalVersion = resume.versions.id(versionId);
    if (!historicalVersion) {
      res.status(404);
      throw new Error('Historical resume version not found');
    }

    const historicalText = historicalVersion.parsedText;

    console.log(`[Analysis Controller] Comparing Resume: ${resume.filename} Active vs Historical Version (${versionId})`);

    // Basic structural calculations for comparing versions without heavy LLM latency
    const activeWordCount = activeText.split(/\s+/).filter(Boolean).length;
    const historicalWordCount = historicalText.split(/\s+/).filter(Boolean).length;

    // Use simple line changes to present direct additions/deletions counts
    const activeLines = activeText.split('\n').map(l => l.trim()).filter(Boolean);
    const historicalLines = historicalText.split('\n').map(l => l.trim()).filter(Boolean);

    const addedLines = activeLines.filter(line => !historicalLines.includes(line));
    const removedLines = historicalLines.filter(line => !activeLines.includes(line));

    res.json({
      success: true,
      data: {
        active: {
          filename: resume.filename,
          wordCount: activeWordCount,
          lineCount: activeLines.length,
          lastUpdated: resume.updatedAt,
        },
        historical: {
          filename: historicalVersion.filename,
          wordCount: historicalWordCount,
          lineCount: historicalLines.length,
          lastUpdated: historicalVersion.uploadDate,
        },
        diffSummary: {
          wordsAdded: Math.max(0, activeWordCount - historicalWordCount),
          wordsRemoved: Math.max(0, historicalWordCount - activeWordCount),
          addedLinesCount: addedLines.length,
          removedLinesCount: removedLines.length,
          addedSamples: addedLines.slice(0, 5), // return a few examples of edits
          removedSamples: removedLines.slice(0, 5),
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Export resume analysis details as printable format/JSON for direct saving
 * @route   GET /api/analyses/export/:id
 * @access  Private
 */
export const exportAnalysisPDF = async (req, res, next) => {
  try {
    const analysis = await Analysis.findOne({ _id: req.params.id, user: req.user._id })
      .populate('resume', 'filename');

    if (!analysis) {
      res.status(404);
      throw new Error('Analysis report not found');
    }

    // We send back HTML string that can be loaded in an iframe or printed cleanly by the browser.
    // Extremely crisp, professional layout.
    const htmlReport = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>AI Resume Analysis Report - ${analysis.resume.filename}</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
        <style>
          body { font-family: 'Inter', sans-serif; color: #1e293b; line-height: 1.6; padding: 40px; background: #fff; max-width: 900px; margin: 0 auto; }
          .header { border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; }
          .title { font-size: 28px; font-weight: 700; color: #0f172a; margin: 0; }
          .meta { font-size: 14px; color: #64748b; margin-top: 5px; }
          .score-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 35px; }
          .score-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; text-align: center; }
          .score-val { font-size: 32px; font-weight: 700; color: #3b82f6; }
          .section-title { font-size: 20px; font-weight: 600; color: #0f172a; border-left: 4px solid #3b82f6; padding-left: 10px; margin-top: 30px; margin-bottom: 15px; }
          .list { padding-left: 20px; }
          .list-item { margin-bottom: 8px; }
          .badge { display: inline-block; background: #e2e8f0; border-radius: 9999px; padding: 3px 12px; font-size: 12px; margin-right: 6px; margin-bottom: 6px; }
          .badge-missing { background: #fee2e2; color: #991b1b; }
          .badge-found { background: #dcfce7; color: #166534; }
          .project-card { border: 1px solid #e2e8f0; border-radius: 6px; padding: 15px; margin-bottom: 15px; background: #fafafa; }
          .project-label { font-weight: 600; font-size: 13px; color: #64748b; }
          .project-text { margin-top: 4px; font-size: 14px; }
          .btn-print { background: #0f172a; color: #fff; border: none; padding: 10px 20px; font-size: 14px; font-weight: 600; border-radius: 6px; cursor: pointer; display: block; margin: 0 auto 30px auto; }
          @media print { .btn-print { display: none; } body { padding: 0; } }
        </style>
      </head>
      <body>
        <button class="btn-print" onclick="window.print()">Print / Save as PDF</button>
        <div class="header">
          <h1 class="title">AI Resume Analysis</h1>
          <div class="meta">Document: ${analysis.resume.filename} | Analyzed on: ${new Date(analysis.createdAt).toLocaleDateString()}</div>
        </div>
        
        <div class="score-grid">
          <div class="score-card">
            <div>Overall Score</div>
            <div class="score-val">${analysis.scores.overall}%</div>
          </div>
          <div class="score-card">
            <div>ATS Optimization</div>
            <div class="score-val">${analysis.scores.ats}%</div>
          </div>
          <div class="score-card">
            <div>Skills Grading</div>
            <div class="score-val">${analysis.scores.skills}%</div>
          </div>
        </div>

        <div class="section-title">Key Strengths</div>
        <ul class="list">
          ${analysis.details.strengths.map(s => `<li class="list-item">${s}</li>`).join('')}
        </ul>

        <div class="section-title">Areas of Weaknesses</div>
        <ul class="list">
          ${analysis.details.weaknesses.map(w => `<li class="list-item">${w}</li>`).join('')}
        </ul>

        <div class="section-title">Skills & Keyword Match</div>
        <div>
          <h4>Identified Skills:</h4>
          <div>${analysis.details.skillsFound.map(s => `<span class="badge badge-found">${s}</span>`).join('')}</div>
          <h4 style="margin-top: 15px;">Suggested / Missing Skills:</h4>
          <div>${analysis.details.skillsMissing.map(s => `<span class="badge badge-missing">${s}</span>`).join('')}</div>
        </div>

        <div class="section-title">AI Optimizations</div>
        <h3>Improved Summary</h3>
        <p style="background: #f8fafc; border: 1px dashed #cbd5e1; padding: 15px; border-radius: 6px; font-style: italic;">
          "${analysis.suggestions.improvedSummary}"
        </p>

        <h3>Project Bullet Point Improvements</h3>
        ${analysis.suggestions.improvedProjects.map(p => `
          <div class="project-card">
            <div><span class="project-label">Original:</span> <span class="project-text">${p.original}</span></div>
            <div style="margin-top: 8px;"><span class="project-label" style="color: #166534;">AI Improved:</span> <span class="project-text" style="font-weight: 500;">${p.improved}</span></div>
            <div style="margin-top: 6px; font-size: 12px; color: #64748b;"><span class="project-label">Rationale:</span> ${p.rationale}</div>
          </div>
        `).join('')}

        <div class="section-title">Interview Preparation Framework</div>
        <ul class="list">
          ${analysis.suggestions.interviewPrep.map(i => `<li class="list-item">${i}</li>`).join('')}
        </ul>
      </body>
      </html>
    `;

    res.send(htmlReport);
  } catch (error) {
    next(error);
  }
};
