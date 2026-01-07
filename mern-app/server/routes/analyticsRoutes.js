const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/auth');
const {
  getDashboardStats,
  getUserStats
} = require('../controllers/analyticsController');

// Protected routes
router.get('/user-stats', protect, getUserStats);

// Admin routes
router.get('/dashboard', protect, isAdmin, getDashboardStats);

module.exports = router;
