const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  generateItinerary,
  getMyItineraries,
  getItinerary,
  deleteItinerary,
  searchItineraries
} = require('../controllers/itineraryController');

// Public route for search
router.get('/search', searchItineraries);

// Protected routes
router.post('/generate', protect, generateItinerary);
router.get('/my-itineraries', protect, getMyItineraries);
router.get('/:id', protect, getItinerary);
router.delete('/:id', protect, deleteItinerary);

module.exports = router;
