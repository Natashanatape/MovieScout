const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const auth = require('../middleware/auth');

router.post('/', auth, quizController.createQuiz);
router.get('/', quizController.getQuizzes);
router.get('/:id', quizController.getQuiz);
router.post('/:id/attempt', auth, quizController.submitAttempt);
router.get('/leaderboard/top', quizController.getLeaderboard);

module.exports = router;
