import path from 'path';
import fs from 'fs/promises';
import multer from 'multer';
import Resume from '../models/Resume.js';
import { parseResumeFile } from '../services/pdfService.js';
import { indexResumeText, deleteResumeVectors } from '../services/ragService.js';

// Configure Multer Disk Storage
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = './uploads';
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (err) {
      cb(err, null);
    }
  },
  filename: (req, file, cb) => {
    // Sanitize filename and append timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_');
    cb(null, `${base}-${uniqueSuffix}${ext}`);
  },
});

// File filter (accept PDF and TXT files)
const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.pdf', '.txt', '.md'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only .pdf, .txt, and .md files are supported!'), false);
  }
};

export const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
}).single('resume');

/**
 * @desc    Upload & parse a resume
 * @route   POST /api/resumes/upload
 * @access  Private
 */
export const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('Please upload a resume file');
    }

    const filePath = req.file.path;
    const originalName = req.file.originalname;

    console.log(`[Resume Controller] File uploaded: ${originalName} -> ${filePath}`);

    // 1. Extract text from document
    const parsedText = await parseResumeFile(filePath);
    if (!parsedText || parsedText.length < 50) {
      res.status(400);
      throw new Error('Could not parse sufficient text from the uploaded document.');
    }

    // 2. Check if a resume with this filename already exists for this user
    let resume = await Resume.findOne({ user: req.user._id, filename: originalName });

    if (resume) {
      console.log(`[Resume Controller] Updating existing resume '${originalName}' with a new version...`);
      
      // Save current main version to history versions array
      resume.versions.push({
        filename: resume.filename,
        filePath: resume.filePath,
        parsedText: resume.parsedText,
        uploadDate: resume.updatedAt || new Date(),
      });

      // Update current main version
      resume.filePath = filePath;
      resume.parsedText = parsedText;
      await resume.save();
    } else {
      console.log(`[Resume Controller] Creating a new resume entry for '${originalName}'...`);
      // Create new resume
      resume = await Resume.create({
        user: req.user._id,
        filename: originalName,
        filePath,
        parsedText,
        versions: [],
      });
    }

    // 3. Vectorize and store text in Qdrant (RAG Pipeline)
    // Run this in background, but await or log status so we know if it succeeded
    const indexed = await indexResumeText(resume._id, req.user._id, parsedText);
    if (!indexed) {
      console.warn(`[Resume Controller] Qdrant vector storage warned during upload, processing continued.`);
    }

    res.status(201).json({
      success: true,
      message: 'Resume uploaded and analyzed successfully',
      data: resume,
    });
  } catch (error) {
    // Cleanup physical file in case of crash
    if (req.file && req.file.path) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkErr) {
        console.error(`[Resume Controller] File cleanup failed: ${unlinkErr.message}`);
      }
    }
    next(error);
  }
};

/**
 * @desc    Get all resumes of logged in user
 * @route   GET /api/resumes
 * @access  Private
 */
export const getMyResumes = async (req, res, next) => {
  try {
    const resumes = await Resume.find({ user: req.user._id })
      .select('-parsedText -versions.parsedText') // Exclude heavy parsed text from listings
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      data: resumes,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single resume by ID
 * @route   GET /api/resumes/:id
 * @access  Private
 */
export const getResumeById = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
    if (!resume) {
      res.status(404);
      throw new Error('Resume not found or unauthorized');
    }

    res.json({
      success: true,
      data: resume,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a resume
 * @route   DELETE /api/resumes/:id
 * @access  Private
 */
export const deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
    if (!resume) {
      res.status(404);
      throw new Error('Resume not found or unauthorized');
    }

    // 1. Delete physical files (main file + historical files)
    const filesToDelete = [resume.filePath, ...resume.versions.map(v => v.filePath)];
    for (const filePath of filesToDelete) {
      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.warn(`[Resume Controller] Could not delete physical file ${filePath}: ${err.message}`);
      }
    }

    // 2. Remove Qdrant vector database records
    await deleteResumeVectors(resume._id);

    // 3. Remove MongoDB document
    await resume.deleteOne();

    res.json({
      success: true,
      message: 'Resume and all associated semantic vectors deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
