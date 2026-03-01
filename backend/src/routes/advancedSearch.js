const express = require('express');
const router = express.Router();
const AdvancedSearchController = require('../controllers/advancedSearchController');
const auth = require('../middleware/auth');

// Advanced search
router.get('/advanced', AdvancedSearchController.advancedSearch);

// Get filter options
router.get('/filters', AdvancedSearchController.getFilterOptions);

// Save search (requires auth)
router.post('/save', auth, AdvancedSearchController.saveSearch);

// Get search history (requires auth)
router.get('/history', auth, AdvancedSearchController.getSearchHistory);

module.exports = router;