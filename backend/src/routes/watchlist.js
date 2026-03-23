const express = require('express');
const router = express.Router();
const WatchlistController = require('../controllers/watchlistController');
const auth = require('../middleware/auth');

router.post('/', auth, WatchlistController.add);
router.delete('/:movie_id', auth, WatchlistController.remove);
router.get('/', auth, WatchlistController.getAll);
router.get('/check/:movie_id', auth, WatchlistController.check);

module.exports = router;
