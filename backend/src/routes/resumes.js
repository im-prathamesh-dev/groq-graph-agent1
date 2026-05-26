import express from 'express';
import { uploadMiddleware, uploadResume, getMyResumes, getResumeById, deleteResume } from '../controllers/resumeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // Ensure all resume endpoints are protected

router.post('/upload', uploadMiddleware, uploadResume);
router.get('/', getMyResumes);
router.get('/:id', getResumeById);
router.delete('/:id', deleteResume);

export default router;
