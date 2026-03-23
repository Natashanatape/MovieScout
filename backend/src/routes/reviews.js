const express = require('express');
const router = express.Router();
const ReviewController = require('../controllers/reviewController');
const auth = require('../middleware/auth');

router.post('/', auth, ReviewController.create);
router.get('/movie/:movie_id', ReviewController.getByMovie);
router.get('/user', auth, ReviewController.getByUser);
router.put('/:id', auth, ReviewController.update);
router.delete('/:id', auth, ReviewController.delete);
router.post('/:id/vote', auth, ReviewController.vote);

module.exports = router;
