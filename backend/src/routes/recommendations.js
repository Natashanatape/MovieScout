const express = require('express');
const router = express.Router();
const RecommendationController = require('../controllers/recommendationController');
const auth = require('../middleware/auth');

router.get('/similar/:movieId', RecommendationController.getSimilarMovies);
router.get('/for-you', auth, RecommendationController.getRecommendations);

module.exports = router;
