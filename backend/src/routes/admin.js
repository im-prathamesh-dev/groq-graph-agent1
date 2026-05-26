import express from 'express';
import { getAdminStats } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route must be logged in and user must have admin role
router.get('/stats', protect, admin, getAdminStats);

export default router;
