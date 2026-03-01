const express = require('express');
const router = express.Router();
const CelebrityController = require('../controllers/celebrityController');

// TEMPORARY: Fix celebrity data (must be before /:id route)
router.get('/fix/data', CelebrityController.fixData);

// TEMPORARY: Reset celebrities completely
router.get('/reset/all', CelebrityController.resetCelebrities);

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ message: 'Celebrity routes working!' });
});

// Get all celebrities
router.get('/', CelebrityController.getAll);

// Search celebrities
router.get('/search', CelebrityController.search);

// Get popular celebrities
router.get('/popular', CelebrityController.getPopular);

// Get celebrities born today
router.get('/born-today', CelebrityController.getBornToday);

// Get celebrity by ID
router.get('/:id', CelebrityController.getById);

// Get celebrity filmography
router.get('/:id/filmography', CelebrityController.getFilmography);

module.exports = router;