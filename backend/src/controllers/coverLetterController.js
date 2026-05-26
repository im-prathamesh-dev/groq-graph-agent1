import Resume from '../models/Resume.js';
import CoverLetter from '../models/CoverLetter.js';
import { generateCoverLetter } from '../services/aiService.js';

/**
 * @desc    Generate cover letter from resume + JD
 * @route   POST /api/cover-letters/generate
 * @access  Private
 */
export const generateUserCoverLetter = async (req, res, next) => {
  const { resumeId, jobDescription } = req.body;

  try {
    if (!resumeId || !jobDescription) {
      res.status(400);
      throw new Error('Please provide resume ID and job description');
    }

    // 1. Fetch Resume
    const resume = await Resume.findOne({ _id: resumeId, user: req.user._id });
    if (!resume) {
      res.status(404);
      throw new Error('Resume not found or unauthorized');
    }

    console.log(`[Cover Letter Controller] Draft cover letter for resume ID: ${resumeId}`);

    // 2. Generate cover letter using Ollama
    const letterContent = await generateCoverLetter(resume.parsedText, jobDescription);

    // 3. Save to MongoDB
    const coverLetter = await CoverLetter.create({
      user: req.user._id,
      resume: resumeId,
      jobDescription,
      letterContent,
    });

    res.status(201).json({
      success: true,
      message: 'Cover letter generated successfully',
      data: coverLetter,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user cover letter history
 * @route   GET /api/cover-letters
 * @access  Private
 */
export const getMyCoverLetters = async (req, res, next) => {
  try {
    const letters = await CoverLetter.find({ user: req.user._id })
      .populate('resume', 'filename')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: letters,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single cover letter by ID
 * @route   GET /api/cover-letters/:id
 * @access  Private
 */
export const getCoverLetterById = async (req, res, next) => {
  try {
    const letter = await CoverLetter.findOne({ _id: req.params.id, user: req.user._id })
      .populate('resume', 'filename');

    if (!letter) {
      res.status(404);
      throw new Error('Cover letter record not found');
    }

    res.json({
      success: true,
      data: letter,
    });
  } catch (error) {
    next(error);
  }
};
