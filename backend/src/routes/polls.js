const express = require('express');
const router = express.Router();
const pollController = require('../controllers/pollController');
const auth = require('../middleware/auth');

router.post('/', auth, pollController.createPoll);
router.get('/', pollController.getPolls);
router.get('/:id', pollController.getPollDetails);
router.post('/:id/vote', auth, pollController.votePoll);
router.get('/:id/results', pollController.getPollResults);

module.exports = router;
