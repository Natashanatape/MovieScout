const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const analyticsController = require('../controllers/analyticsController');
const authenticateToken = require('../middleware/auth');

// Subscription routes
router.get('/plans', subscriptionController.getPlans);
router.post('/subscribe', authenticateToken, subscriptionController.createSubscription);
router.get('/subscription/current', authenticateToken, subscriptionController.getCurrentSubscription);
router.post('/subscription/cancel', authenticateToken, subscriptionController.cancelSubscription);
router.get('/payments', authenticateToken, subscriptionController.getPaymentHistory);
router.get('/invoices', authenticateToken, subscriptionController.getInvoices);
router.get('/pro/contacts/:personId', authenticateToken, subscriptionController.getProContacts);
router.get('/pro/status', authenticateToken, subscriptionController.checkProStatus);

// Analytics routes
router.post('/analytics/track', analyticsController.trackEvent);
router.get('/analytics/dashboard', authenticateToken, analyticsController.getDashboard);
router.get('/analytics/celebrity/:personId', authenticateToken, analyticsController.getCelebrityAnalytics);
router.get('/analytics/movie/:movieId', authenticateToken, analyticsController.getMovieAnalytics);
router.get('/analytics/export', authenticateToken, analyticsController.exportData);

module.exports = router;
