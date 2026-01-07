const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// @desc    Create payment order
// @route   POST /api/payments/create-order
// @access  Private
exports.createPaymentOrder = async (req, res) => {
  try {
    const { bookingId } = req.body;

    // Validate booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if booking belongs to user
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Check booking status
    if (booking.status !== 'initiated' && booking.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Booking is not in valid state for payment'
      });
    }

    // Check if inventory lock is still valid
    if (booking.inventoryLock.expiresAt < new Date()) {
      booking.status = 'failed';
      await booking.save();
      
      return res.status(400).json({
        success: false,
        message: 'Booking has expired. Please create a new booking.'
      });
    }

    // Create Razorpay order
    const options = {
      amount: booking.pricing.totalAmount * 100, // amount in paise
      currency: 'INR',
      receipt: booking.bookingId,
      notes: {
        bookingId: booking._id.toString(),
        userId: req.user._id.toString(),
        propertyId: booking.propertyId.toString()
      }
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Create payment record
    const payment = await Payment.create({
      bookingId: booking._id,
      userId: req.user._id,
      amount: {
        currency: 'INR',
        total: booking.pricing.totalAmount,
        pending: booking.pricing.totalAmount
      },
      gateway: {
        provider: 'razorpay',
        orderId: razorpayOrder.id,
        paymentDetails: razorpayOrder
      },
      status: 'created',
      security: {
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      }
    });

    // Update booking
    booking.status = 'pending';
    booking.paymentId = payment._id;
    booking.paymentStatus = 'pending';
    await booking.save();

    res.json({
      success: true,
      message: 'Payment order created successfully',
      data: {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        paymentId: payment._id,
        key: process.env.RAZORPAY_KEY_ID
      }
    });
  } catch (error) {
    console.error('Create payment order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating payment order',
      error: error.message
    });
  }
};

// @desc    Verify payment
// @route   POST /api/payments/verify
// @access  Private
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentId
    } = req.body;

    // Get payment record
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found'
      });
    }

    // Verify signature
    const text = razorpay_order_id + '|' + razorpay_payment_id;
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      // Signature verification failed
      payment.status = 'failed';
      payment.attempts.push({
        attemptNumber: payment.totalAttempts + 1,
        timestamp: new Date(),
        status: 'failed',
        errorCode: 'SIGNATURE_VERIFICATION_FAILED',
        errorMessage: 'Payment signature verification failed'
      });
      payment.totalAttempts += 1;
      await payment.save();

      // Update booking
      const booking = await Booking.findById(payment.bookingId);
      if (booking) {
        booking.status = 'failed';
        booking.paymentStatus = 'failed';
        await booking.save();
      }

      return res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }

    // Verify with Razorpay API
    const razorpayPayment = await razorpay.payments.fetch(razorpay_payment_id);

    if (razorpayPayment.status !== 'captured' && razorpayPayment.status !== 'authorized') {
      payment.status = 'failed';
      payment.gateway.transactionId = razorpay_payment_id;
      payment.gateway.paymentMethod = razorpayPayment.method;
      payment.gateway.paymentDetails = razorpayPayment;
      await payment.save();

      return res.status(400).json({
        success: false,
        message: 'Payment not successful'
      });
    }

    // Payment successful
    payment.status = 'success';
    payment.amount.paid = payment.amount.total;
    payment.amount.pending = 0;
    payment.gateway.transactionId = razorpay_payment_id;
    payment.gateway.paymentMethod = razorpayPayment.method;
    payment.gateway.paymentDetails = razorpayPayment;
    payment.verification = {
      isVerified: true,
      verifiedAt: new Date(),
      verificationMethod: 'signature',
      signature: razorpay_signature
    };
    payment.settlement.status = 'pending';
    await payment.save();

    // Update booking to confirmed
    const booking = await Booking.findById(payment.bookingId);
    if (booking) {
      booking.status = 'confirmed';
      booking.paymentStatus = 'completed';
      booking.inventoryLock.isLocked = false;
      await booking.save();
    }

    // Log audit
    payment.auditLog.push({
      action: 'PAYMENT_VERIFIED',
      performedBy: 'system',
      timestamp: new Date(),
      details: { razorpay_payment_id, razorpay_order_id }
    });
    await payment.save();

    res.json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        payment,
        booking
      }
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying payment',
      error: error.message
    });
  }
};

// @desc    Handle payment failure
// @route   POST /api/payments/:id/failure
// @access  Private
exports.handlePaymentFailure = async (req, res) => {
  try {
    const { error } = req.body;
    const paymentId = req.params.id;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Update payment status
    payment.status = 'failed';
    payment.attempts.push({
      attemptNumber: payment.totalAttempts + 1,
      timestamp: new Date(),
      status: 'failed',
      errorCode: error?.code || 'UNKNOWN',
      errorMessage: error?.description || 'Payment failed'
    });
    payment.totalAttempts += 1;
    await payment.save();

    // Update booking
    const booking = await Booking.findById(payment.bookingId);
    if (booking) {
      booking.paymentStatus = 'failed';
      
      // If max attempts reached, mark booking as failed
      if (payment.totalAttempts >= 3) {
        booking.status = 'failed';
        await booking.save();
        
        // Release inventory
        // (implement inventory release logic)
      } else {
        await booking.save();
      }
    }

    res.json({
      success: false,
      message: 'Payment failed',
      data: {
        payment,
        canRetry: payment.totalAttempts < 3
      }
    });
  } catch (error) {
    console.error('Handle payment failure error:', error);
    res.status(500).json({
      success: false,
      message: 'Error handling payment failure',
      error: error.message
    });
  }
};

// @desc    Initiate refund
// @route   POST /api/payments/:id/refund
// @access  Private (Admin)
exports.initiateRefund = async (req, res) => {
  try {
    const { amount, reason } = req.body;
    const paymentId = req.params.id;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    if (payment.status !== 'success') {
      return res.status(400).json({
        success: false,
        message: 'Can only refund successful payments'
      });
    }

    const refundAmount = amount || payment.amount.total;

    if (refundAmount > payment.amount.paid) {
      return res.status(400).json({
        success: false,
        message: 'Refund amount cannot exceed paid amount'
      });
    }

    // Create refund in Razorpay
    const refund = await razorpay.payments.refund(payment.gateway.transactionId, {
      amount: refundAmount * 100, // amount in paise
      notes: {
        reason: reason || 'Booking cancellation'
      }
    });

    // Update payment record
    payment.refunds.push({
      refundId: refund.id,
      amount: refundAmount,
      reason,
      status: 'processing',
      initiatedAt: new Date(),
      processedBy: req.user._id,
      gatewayRefundId: refund.id
    });

    payment.amount.refunded += refundAmount;
    payment.amount.pending = payment.amount.total - payment.amount.paid - payment.amount.refunded;
    
    if (payment.amount.refunded >= payment.amount.paid) {
      payment.status = 'refunded';
    } else {
      payment.status = 'partially-refunded';
    }

    payment.auditLog.push({
      action: 'REFUND_INITIATED',
      performedBy: req.user._id.toString(),
      timestamp: new Date(),
      details: { refundId: refund.id, amount: refundAmount, reason }
    });

    await payment.save();

    res.json({
      success: true,
      message: 'Refund initiated successfully',
      data: {
        refundId: refund.id,
        amount: refundAmount,
        status: refund.status
      }
    });
  } catch (error) {
    console.error('Initiate refund error:', error);
    res.status(500).json({
      success: false,
      message: 'Error initiating refund',
      error: error.message
    });
  }
};

// @desc    Get payment details
// @route   GET /api/payments/:id
// @access  Private
exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('bookingId')
      .populate('userId', 'name email');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Check authorization
    if (req.user.role !== 'admin' && payment.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this payment'
      });
    }

    res.json({
      success: true,
      data: payment
    });
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payment',
      error: error.message
    });
  }
};

// @desc    Webhook handler for Razorpay
// @route   POST /api/payments/webhook
// @access  Public (but verified)
exports.handleWebhook = async (req, res) => {
  try {
    const webhookSignature = req.headers['x-razorpay-signature'];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (webhookSignature !== expectedSignature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid webhook signature'
      });
    }

    const event = req.body.event;
    const payloadData = req.body.payload.payment.entity;

    // Handle different events
    switch (event) {
      case 'payment.captured':
        await handlePaymentCaptured(payloadData);
        break;
      case 'payment.failed':
        await handlePaymentFailedWebhook(payloadData);
        break;
      case 'refund.processed':
        await handleRefundProcessed(payloadData);
        break;
      default:
        console.log('Unhandled webhook event:', event);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({
      success: false,
      message: 'Webhook processing failed',
      error: error.message
    });
  }
};

// Helper functions for webhook handlers
async function handlePaymentCaptured(paymentData) {
  const payment = await Payment.findOne({ 'gateway.orderId': paymentData.order_id });
  if (payment && payment.status !== 'success') {
    payment.status = 'success';
    payment.amount.paid = paymentData.amount / 100;
    payment.gateway.transactionId = paymentData.id;
    await payment.save();
  }
}

async function handlePaymentFailedWebhook(paymentData) {
  const payment = await Payment.findOne({ 'gateway.orderId': paymentData.order_id });
  if (payment) {
    payment.status = 'failed';
    await payment.save();
  }
}

async function handleRefundProcessed(refundData) {
  const payment = await Payment.findOne({ 'gateway.transactionId': refundData.payment_id });
  if (payment) {
    const refund = payment.refunds.find(r => r.gatewayRefundId === refundData.id);
    if (refund) {
      refund.status = 'completed';
      refund.completedAt = new Date();
      await payment.save();
    }
  }
}

module.exports = exports;
