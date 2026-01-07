const mongoose = require('mongoose');

const cancellationSchema = new mongoose.Schema({
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
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  },
  
  // Cancellation Details
  cancellationId: {
    type: String,
    unique: true,
    required: true
  },
  cancelledAt: {
    type: Date,
    default: Date.now
  },
  cancelledBy: {
    type: String,
    enum: ['user', 'admin', 'system', 'property-owner'],
    required: true
  },
  
  // Booking Information
  bookingDetails: {
    bookingId: String,
    checkIn: Date,
    checkOut: Date,
    nights: Number,
    totalAmount: Number
  },
  
  // Cancellation Reason
  reason: {
    category: {
      type: String,
      enum: ['user-request', 'payment-failure', 'property-unavailable', 'force-majeure', 'policy-violation', 'admin-action', 'other'],
      required: true
    },
    description: String,
    additionalInfo: String
  },
  
  // Refund Calculation
  refund: {
    // Policy applied
    policyApplied: {
      daysBeforeCheckIn: Number,
      refundPercentage: Number,
      policyType: String // full, partial, no-refund
    },
    
    // Amount breakdown
    originalAmount: { type: Number, required: true },
    cancellationCharges: { type: Number, default: 0 },
    processingFees: { type: Number, default: 0 },
    refundableAmount: { type: Number, required: true },
    
    // Refund status
    status: {
      type: String,
      enum: ['not-applicable', 'pending', 'processing', 'approved', 'initiated', 'completed', 'failed', 'rejected'],
      default: 'pending'
    },
    
    // Refund processing
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approvedAt: Date,
    initiatedAt: Date,
    completedAt: Date,
    failureReason: String,
    
    // Gateway details
    refundTransactionId: String,
    refundMethod: String, // original-method, bank-transfer, wallet
    refundReference: String,
    
    // Timeline
    expectedCompletionDate: Date,
    actualCompletionDate: Date
  },
  
  // Notifications
  notifications: {
    userNotified: { type: Boolean, default: false },
    propertyNotified: { type: Boolean, default: false },
    refundNotificationSent: { type: Boolean, default: false }
  },
  
  // Admin Actions
  adminReview: {
    reviewed: { type: Boolean, default: false },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: Date,
    remarks: String,
    approved: Boolean
  },
  
  // Dispute
  dispute: {
    isDisputed: { type: Boolean, default: false },
    disputeReason: String,
    disputeStatus: {
      type: String,
      enum: ['pending', 'under-review', 'resolved', 'escalated']
    },
    resolution: String,
    resolvedAt: Date
  },
  
  // Audit Trail
  auditLog: [{
    action: String,
    performedBy: String,
    timestamp: { type: Date, default: Date.now },
    details: mongoose.Schema.Types.Mixed
  }]
  
}, {
  timestamps: true
});

// Indexes
cancellationSchema.index({ cancellationId: 1 });
cancellationSchema.index({ bookingId: 1 });
cancellationSchema.index({ userId: 1 });
cancellationSchema.index({ 'refund.status': 1 });
cancellationSchema.index({ createdAt: -1 });

// Generate cancellation ID
cancellationSchema.pre('save', async function(next) {
  if (!this.cancellationId) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.cancellationId = `CAN${year}${month}${random}`;
  }
  next();
});

// Method to calculate refund based on cancellation policy
cancellationSchema.methods.calculateRefund = function(checkInDate, totalAmount, cancellationPolicy) {
  const now = new Date();
  const daysUntilCheckIn = Math.ceil((checkInDate - now) / (1000 * 60 * 60 * 24));
  
  let refundPercentage = 0;
  let policyType = 'no-refund';
  
  if (daysUntilCheckIn >= cancellationPolicy.fullRefund) {
    refundPercentage = 100;
    policyType = 'full';
  } else if (daysUntilCheckIn >= cancellationPolicy.partialRefund) {
    refundPercentage = cancellationPolicy.refundPercentage;
    policyType = 'partial';
  } else {
    refundPercentage = 0;
    policyType = 'no-refund';
  }
  
  const processingFees = totalAmount * 0.02; // 2% processing fee
  const cancellationCharges = totalAmount * ((100 - refundPercentage) / 100);
  const refundableAmount = Math.max(0, totalAmount - cancellationCharges - processingFees);
  
  this.refund.policyApplied = {
    daysBeforeCheckIn: daysUntilCheckIn,
    refundPercentage,
    policyType
  };
  
  this.refund.originalAmount = totalAmount;
  this.refund.cancellationCharges = cancellationCharges;
  this.refund.processingFees = processingFees;
  this.refund.refundableAmount = refundableAmount;
  
  if (refundableAmount > 0) {
    this.refund.status = 'pending';
    this.refund.expectedCompletionDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  } else {
    this.refund.status = 'not-applicable';
  }
  
  return refundableAmount;
};

module.exports = mongoose.model('Cancellation', cancellationSchema);
