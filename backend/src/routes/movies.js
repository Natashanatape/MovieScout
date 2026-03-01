const express = require('express');
const router = express.Router();
const MovieController = require('../controllers/movieController');

router.get('/', MovieController.getAll);
router.get('/search', MovieController.search);
router.get('/trending', MovieController.getTrending);
router.get('/popular', MovieController.getPopular);
router.get('/tv-shows', MovieController.getTVShows);
router.get('/genre/:genre', MovieController.getByGenre);
router.get('/:id', MovieController.getById);

module.exports = router;
