const express = require('express');
const router = express.Router();
const StreamingController = require('../controllers/streamingController');
const auth = require('../middleware/auth');

router.get('/platforms', StreamingController.getPlatforms);
router.get('/movie/:id', StreamingController.getMovieStreaming);
router.post('/price-alert', auth, StreamingController.setPriceAlert);
router.get('/user/alerts', auth, StreamingController.getUserAlerts);

module.exports = router;
