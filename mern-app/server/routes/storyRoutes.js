const express = require('express');
const router = express.Router();
const { protect, isAdmin, optionalAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getAllStories,
  getMyStories,
  createStory,
  moderateStory,
  deleteStory,
  incrementViews
} = require('../controllers/storyController');

// Public routes (with optional auth for admin filtering)
router.get('/', optionalAuth, getAllStories);
router.put('/:id/view', incrementViews);

// Protected routes
router.get('/my-stories', protect, getMyStories);
router.post('/', protect, upload.single('media'), createStory);
router.delete('/:id', protect, deleteStory);

// Admin routes
router.put('/:id/moderate', protect, isAdmin, moderateStory);

module.exports = router;
