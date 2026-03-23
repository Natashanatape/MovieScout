const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photoController');
const auth = require('../middleware/auth');

router.get('/movie/:movieId', photoController.getMoviePhotos);
router.post('/', auth, photoController.addPhoto);

module.exports = router;
