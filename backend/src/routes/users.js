const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Multer config for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profiles/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files allowed'));
  }
});

// Get profile
router.get('/profile/:id?', auth, UserController.getProfile);

// Update profile
router.put('/profile', auth, UserController.updateProfile);

// Upload profile image
router.post('/profile/image', auth, upload.single('image'), UserController.uploadProfileImage);

// Get user ratings
router.get('/ratings/:id?', auth, UserController.getUserRatings);

// Get user reviews
router.get('/reviews/:id?', auth, UserController.getUserReviews);

// Change password
router.post('/change-password', auth, UserController.changePassword);

module.exports = router;
