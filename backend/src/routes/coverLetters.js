import express from 'express';
import {
  generateUserCoverLetter,
  getMyCoverLetters,
  getCoverLetterById,
} from '../controllers/coverLetterController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // Secure letter operations

router.post('/generate', generateUserCoverLetter);
router.get('/', getMyCoverLetters);
router.get('/:id', getCoverLetterById);

export default router;
