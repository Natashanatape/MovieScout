const express = require('express');
const router = express.Router();
const socialController = require('../controllers/socialController');
const auth = require('../middleware/auth');

router.post('/follow/:userId', auth, socialController.followUser);
router.delete('/unfollow/:userId', auth, socialController.unfollowUser);
router.get('/followers/:userId', socialController.getFollowers);
router.get('/following/:userId', socialController.getFollowing);
router.get('/check-following/:userId', auth, socialController.checkFollowing);
router.get('/feed', auth, socialController.getActivityFeed);
router.get('/stats/:userId', socialController.getFollowStats);

module.exports = router;
