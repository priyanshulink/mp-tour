const express = require('express');
const router = express.Router();
const {
  createPaymentOrder,
  verifyPayment,
  handlePaymentFailure,
  initiateRefund,
  getPaymentById,
  handleWebhook
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');

// Public webhook endpoint
router.post('/webhook', handleWebhook);

// Protected routes
router.use(protect);

router.post('/create-order', createPaymentOrder);
router.post('/verify', verifyPayment);
router.post('/:id/failure', handlePaymentFailure);
router.post('/:id/refund', authorize('admin'), initiateRefund);
router.get('/:id', getPaymentById);

module.exports = router;
