const express = require('express');
const router = express.Router();
const CollectionController = require('../controllers/collectionController');

router.get('/', CollectionController.getAll);
router.get('/:id', CollectionController.getById);

module.exports = router;
