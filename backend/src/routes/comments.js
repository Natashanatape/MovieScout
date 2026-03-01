const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const auth = require('../middleware/auth');

router.post('/', auth, commentController.createComment);
router.get('/review/:reviewId', commentController.getReviewComments);
router.put('/:id', auth, commentController.updateComment);
router.delete('/:id', auth, commentController.deleteComment);
router.post('/:id/vote', auth, commentController.voteComment);

module.exports = router;
