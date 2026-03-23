const express = require('express');
const router = express.Router();
const awardController = require('../controllers/awardController');

router.get('/', awardController.getAwards);
router.get('/:id/nominations', awardController.getAwardNominations);
router.get('/movie/:movieId', awardController.getMovieAwards);
router.get('/calendar/upcoming', awardController.getAwardsCalendar);

module.exports = router;
