const express = require('express');
const router = express.Router();
const RatingController = require('../controllers/ratingController');
const auth = require('../middleware/auth');

router.post('/', auth, RatingController.create);
router.get('/movie/:movie_id', auth, RatingController.getUserRating);

module.exports = router;
