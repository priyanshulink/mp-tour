const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  // Booking Identification
  bookingId: {
    type: String,
    unique: true,
    required: true
  },
  
  // References
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
  
  // Guest Information
  guestDetails: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    idProof: {
      type: String,
      number: String
    },
    address: String,
    adults: { type: Number, required: true, min: 1 },
    children: { type: Number, default: 0 },
    specialRequests: String
  },
  
  // Booking Dates
  checkIn: {
    type: Date,
    required: true
  },
  checkOut: {
    type: Date,
    required: true
  },
  nights: {
    type: Number,
    required: true
  },
  
  // Room Details
  rooms: [{
    roomType: String,
    quantity: Number,
    pricePerNight: Number
  }],
  totalRooms: {
    type: Number,
    required: true
  },
  
  // Pricing Breakdown
  pricing: {
    baseAmount: { type: Number, required: true },
    seasonalCharge: { type: Number, default: 0 },
    weekendCharge: { type: Number, default: 0 },
    subtotal: { type: Number, required: true },
    gst: { type: Number, required: true },
    tourismFee: { type: Number, default: 0 },
    discount: {
      code: String,
      amount: { type: Number, default: 0 }
    },
    totalAmount: { type: Number, required: true }
  },
  
  // Booking Status
  status: {
    type: String,
    enum: ['initiated', 'pending', 'confirmed', 'checked-in', 'checked-out', 'completed', 'cancelled', 'failed'],
    default: 'initiated'
  },
  
  // Status History
  statusHistory: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    updatedBy: String,
    remarks: String
  }],
  
  // Payment Information
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded', 'partially-refunded'],
    default: 'pending'
  },
  
  // Inventory Lock
  inventoryLock: {
    isLocked: { type: Boolean, default: false },
    lockedAt: Date,
    expiresAt: Date
  },
  
  // Cancellation
  cancellation: {
    isCancelled: { type: Boolean, default: false },
    cancelledAt: Date,
    cancelledBy: {
      type: String,
      enum: ['user', 'admin', 'system', 'property']
    },
    reason: String,
    refundAmount: Number,
    refundStatus: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'not-applicable']
    },
    refundId: String
  },
  
  // Check-in/Check-out
  checkInDetails: {
    actualCheckIn: Date,
    checkedInBy: String,
    verificationDone: Boolean
  },
  checkOutDetails: {
    actualCheckOut: Date,
    checkedOutBy: String,
    feedbackProvided: Boolean
  },
  
  // Admin Actions
  adminActions: [{
    action: String,
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now },
    remarks: String
  }],
  
  // Notifications
  notifications: {
    confirmationSent: { type: Boolean, default: false },
    reminderSent: { type: Boolean, default: false },
    feedbackRequested: { type: Boolean, default: false }
  },
  
  // Metadata
  source: {
    type: String,
    enum: ['web', 'mobile', 'admin', 'api'],
    default: 'web'
  },
  ipAddress: String,
  userAgent: String,
  
}, {
  timestamps: true
});

// Indexes
bookingSchema.index({ bookingId: 1 });
bookingSchema.index({ userId: 1, status: 1 });
bookingSchema.index({ propertyId: 1, checkIn: 1, checkOut: 1 });
bookingSchema.index({ status: 1, createdAt: -1 });
bookingSchema.index({ 'inventoryLock.expiresAt': 1 });

// Pre-save middleware to calculate nights
bookingSchema.pre('save', function(next) {
  if (this.isModified('checkIn') || this.isModified('checkOut')) {
    const oneDay = 24 * 60 * 60 * 1000;
    this.nights = Math.round((this.checkOut - this.checkIn) / oneDay);
  }
  
  // Add status to history
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
      remarks: 'Status updated'
    });
  }
  
  next();
});

// Generate booking ID
bookingSchema.pre('save', async function(next) {
  if (!this.bookingId) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.bookingId = `MPT${year}${month}${random}`;
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
