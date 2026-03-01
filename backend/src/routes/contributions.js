const express = require('express');
const router = express.Router();
const contributionController = require('../controllers/contributionController');
const auth = require('../middleware/auth');

// Trivia
router.post('/trivia', auth, contributionController.submitTrivia);
router.get('/trivia/movie/:movieId', contributionController.getMovieTrivia);
router.post('/trivia/:id/vote', auth, contributionController.voteTrivia);

// Goofs
router.post('/goofs', auth, contributionController.submitGoof);
router.get('/goofs/movie/:movieId', contributionController.getMovieGoofs);

// Quotes
router.post('/quotes', auth, contributionController.submitQuote);
router.get('/quotes/movie/:movieId', contributionController.getMovieQuotes);

// Reputation
router.get('/reputation/:userId', contributionController.getUserReputation);

module.exports = router;
