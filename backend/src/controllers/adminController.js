import User from '../models/User.js';
import Resume from '../models/Resume.js';
import Analysis from '../models/Analysis.js';
import CoverLetter from '../models/CoverLetter.js';

/**
 * @desc    Get dashboard aggregated statistics (Admin Only)
 * @route   GET /api/admin/stats
 * @access  Private/Admin
 */
export const getAdminStats = async (req, res, next) => {
  try {
    // 1. Gather numerical counts
    const totalUsers = await User.countDocuments();
    const totalResumes = await Resume.countDocuments();
    const totalAnalyses = await Analysis.countDocuments();
    const totalCoverLetters = await CoverLetter.countDocuments();

    // 2. Aggregate counts over time (last 7 days uploads)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const uploadsHistory = await Resume.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const analysesHistory = await Analysis.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // 3. User lists with record numbers
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        metrics: {
          totalUsers,
          totalResumes,
          totalAnalyses,
          totalCoverLetters,
          // Estimating prompt calls: 1 prompt per analysis, 1 per cover letter, plus text embeddings
          totalAiOperations: totalAnalyses * 2 + totalCoverLetters,
        },
        uploadsHistory,
        analysesHistory,
        users,
      },
    });
  } catch (error) {
    next(error);
  }
};
