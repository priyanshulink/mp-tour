const express = require('express');
const router = express.Router();
const {
  getProperties,
  getPropertyById,
  checkAvailability,
  createProperty,
  updateProperty,
  deleteProperty
} = require('../controllers/propertyController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getProperties);
router.get('/:id', getPropertyById);
router.post('/:id/check-availability', checkAvailability);

// Protected routes
router.post('/', protect, authorize('admin', 'property-owner'), createProperty);
router.put('/:id', protect, authorize('admin', 'property-owner'), updateProperty);
router.delete('/:id', protect, authorize('admin'), deleteProperty);

module.exports = router;
