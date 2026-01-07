const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  // Payment Identification
  paymentId: {
    type: String,
    unique: true,
    required: true
  },
  
  // References
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Amount Details
  amount: {
    currency: { type: String, default: 'INR' },
    total: { type: Number, required: true },
    paid: { type: Number, default: 0 },
    refunded: { type: Number, default: 0 },
    pending: { type: Number, default: 0 }
  },
  
  // Payment Gateway Details
  gateway: {
    provider: {
      type: String,
      enum: ['razorpay', 'paytm', 'ccavenue', 'government-gateway'],
      default: 'razorpay'
    },
    orderId: String,
    transactionId: String,
    paymentMethod: String, // card, netbanking, upi, wallet
    paymentDetails: mongoose.Schema.Types.Mixed
  },
  
  // Payment Status
  status: {
    type: String,
    enum: ['created', 'pending', 'processing', 'authorized', 'captured', 'success', 'failed', 'cancelled', 'refund-initiated', 'refunded', 'partially-refunded'],
    default: 'created'
  },
  
  // Status Timeline
  statusTimeline: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    message: String,
    metadata: mongoose.Schema.Types.Mixed
  }],
  
  // Payment Attempts
  attempts: [{
    attemptNumber: Number,
    timestamp: Date,
    status: String,
    errorCode: String,
    errorMessage: String,
    gateway: String
  }],
  totalAttempts: {
    type: Number,
    default: 0
  },
  
  // Verification
  verification: {
    isVerified: { type: Boolean, default: false },
    verifiedAt: Date,
    verificationMethod: String,
    signature: String
  },
  
  // Refund Details
  refunds: [{
    refundId: String,
    amount: Number,
    reason: String,
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed']
    },
    initiatedAt: Date,
    completedAt: Date,
    processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    gatewayRefundId: String
  }],
  
  // Settlement
  settlement: {
    status: {
      type: String,
      enum: ['pending', 'processing', 'settled', 'failed'],
      default: 'pending'
    },
    settledAt: Date,
    settlementId: String,
    amount: Number
  },
  
  // Security
  security: {
    ipAddress: String,
    userAgent: String,
    fingerprint: String
  },
  
  // Audit Trail
  auditLog: [{
    action: String,
    performedBy: String,
    timestamp: { type: Date, default: Date.now },
    details: mongoose.Schema.Types.Mixed
  }],
  
  // Expiry (for pending payments)
  expiresAt: {
    type: Date
  },
  
  // Metadata
  metadata: {
    invoiceNumber: String,
    receiptUrl: String,
    notes: String
  }
  
}, {
  timestamps: true
});

// Indexes
paymentSchema.index({ paymentId: 1 });
paymentSchema.index({ bookingId: 1 });
paymentSchema.index({ userId: 1, status: 1 });
paymentSchema.index({ 'gateway.orderId': 1 });
paymentSchema.index({ 'gateway.transactionId': 1 });
paymentSchema.index({ status: 1, createdAt: -1 });
paymentSchema.index({ expiresAt: 1 });

// Pre-save middleware
paymentSchema.pre('save', function(next) {
  // Update status timeline
  if (this.isModified('status')) {
    this.statusTimeline.push({
      status: this.status,
      timestamp: new Date(),
      message: `Status changed to ${this.status}`
    });
  }
  
  // Calculate pending amount
  this.amount.pending = this.amount.total - this.amount.paid - this.amount.refunded;
  
  next();
});

// Generate payment ID
paymentSchema.pre('save', async function(next) {
  if (!this.paymentId) {
    const date = new Date();
    const timestamp = date.getTime().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.paymentId = `PAY${timestamp}${random}`;
  }
  next();
});

// Auto-expire pending payments after 15 minutes
paymentSchema.pre('save', function(next) {
  if (this.isNew && this.status === 'created') {
    this.expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
  }
  next();
});

module.exports = mongoose.model('Payment', paymentSchema);
