const express = require('express');
const router = express.Router();
const miscController = require('../controllers/miscController');
const auth = require('../middleware/auth');

// Spoiler
router.get('/spoiler-settings', auth, miscController.getSpoilerSettings);
router.put('/spoiler-settings', auth, miscController.updateSpoilerSettings);
router.post('/report-comment', auth, miscController.reportComment);

// Popularity
router.get('/popular-movies', miscController.getPopularMovies);
router.get('/trending-celebrities', miscController.getTrendingCelebrities);

// Born Today
router.get('/born-today', miscController.getBornToday);
router.get('/born-on/:date', miscController.getBornOnDate);

module.exports = router;
