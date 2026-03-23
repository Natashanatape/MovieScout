const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const auth = require('../middleware/auth');

router.get('/featured', videoController.getFeatured);
router.get('/latest', videoController.getLatest);
router.get('/type/:type', videoController.getByType);
router.get('/search', videoController.search);
router.get('/movie/:movieId', videoController.getMovieVideos);
router.get('/:id', videoController.getVideo);
router.post('/', auth, videoController.addVideo);
router.post('/:videoId/view', videoController.trackView);
router.get('/:videoId/views', videoController.getViewsCount);

module.exports = router;
