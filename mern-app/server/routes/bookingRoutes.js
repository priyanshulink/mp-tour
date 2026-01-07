const express = require('express');
const router = express.Router();
const {
  createBooking,
  getBookingById,
  getUserBookings,
  confirmBooking,
  cancelBooking,
  checkIn,
  checkOut
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

// All booking routes require authentication
router.use(protect);

router.post('/', createBooking);
router.get('/user/my-bookings', getUserBookings);
router.get('/:id', getBookingById);
router.put('/:id/confirm', confirmBooking);
router.put('/:id/cancel', cancelBooking);
router.put('/:id/check-in', authorize('admin', 'property-owner'), checkIn);
router.put('/:id/check-out', authorize('admin', 'property-owner'), checkOut);

module.exports = router;
