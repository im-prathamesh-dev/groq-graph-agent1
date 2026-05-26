import express from 'express';
import {
  analyzeUserResume,
  getMyAnalyses,
  getAnalysisById,
  compareResumeVersions,
  exportAnalysisPDF,
} from '../controllers/analysisController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // Secure all analysis routes

router.post('/analyze/:resumeId', analyzeUserResume);
router.get('/', getMyAnalyses);
router.get('/:id', getAnalysisById);
router.post('/compare/:resumeId', compareResumeVersions);
router.get('/export/:id', exportAnalysisPDF);

export default router;
