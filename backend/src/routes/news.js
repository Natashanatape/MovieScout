const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const auth = require('../middleware/auth');

router.get('/', newsController.getAllNews);
router.get('/:id', newsController.getNewsById);
router.post('/', auth, newsController.addNews);

module.exports = router;
