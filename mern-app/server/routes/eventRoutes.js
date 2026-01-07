const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getAllEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');

// Public routes
router.get('/', getAllEvents);
router.get('/:id', getEvent);

// Protected/Admin routes
router.post('/', protect, isAdmin, upload.single('image'), createEvent);
router.put('/:id', protect, isAdmin, upload.single('image'), updateEvent);
router.delete('/:id', protect, isAdmin, deleteEvent);

module.exports = router;
