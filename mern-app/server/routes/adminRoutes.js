const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllBookings,
  approveProperty,
  rejectProperty,
  updateAvailability,
  getRevenueReport,
  getOccupancyReport,
  getCancellations,
  approveRefund
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// Dashboard
router.get('/dashboard', getDashboardStats);

// Bookings Management
router.get('/bookings', getAllBookings);

// Property Management
router.put('/properties/:id/approve', approveProperty);
router.put('/properties/:id/reject', rejectProperty);
router.put('/properties/:id/availability', updateAvailability);

// Reports
router.get('/reports/revenue', getRevenueReport);
router.get('/reports/occupancy', getOccupancyReport);

// Cancellations & Refunds
router.get('/cancellations', getCancellations);
router.put('/cancellations/:id/approve-refund', approveRefund);

module.exports = router;
