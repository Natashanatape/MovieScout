const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');
const auth = require('../middleware/auth');

// Admin authentication middleware
const adminAuth = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Apply auth middleware to all admin routes
router.use(auth);
router.use(adminAuth);

// Dashboard
router.get('/dashboard/stats', AdminController.getDashboardStats);
router.get('/analytics', AdminController.getAnalytics);

// User Management
router.get('/users', AdminController.getAllUsers);
router.put('/users/:userId/role', AdminController.updateUserRole);
router.delete('/users/:userId', AdminController.deleteUser);

// Movie Management
router.get('/movies', AdminController.getAllMovies);
router.delete('/movies/:movieId', AdminController.deleteMovie);

// Review Management
router.get('/reviews', AdminController.getAllReviews);
router.delete('/reviews/:reviewId', AdminController.deleteReview);

// Settings Management
router.get('/settings', AdminController.getSettings);
router.put('/settings', AdminController.updateSetting);

// Admin Logs
router.get('/logs', AdminController.getAdminLogs);

module.exports = router;