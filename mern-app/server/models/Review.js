const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
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
  
  // Rating Details
  ratings: {
    overall: { type: Number, required: true, min: 1, max: 5 },
    cleanliness: { type: Number, min: 1, max: 5 },
    amenities: { type: Number, min: 1, max: 5 },
    location: { type: Number, min: 1, max: 5 },
    service: { type: Number, min: 1, max: 5 },
    valueForMoney: { type: Number, min: 1, max: 5 }
  },
  
  // Review Content
  title: {
    type: String,
    maxlength: 100
  },
  review: {
    type: String,
    required: true,
    maxlength: 1000
  },
  
  // Stay Details
  stayDetails: {
    checkIn: Date,
    checkOut: Date,
    travelType: {
      type: String,
      enum: ['solo', 'couple', 'family', 'friends', 'business']
    }
  },
  
  // Media
  photos: [{
    url: String,
    caption: String
  }],
  
  // Moderation
  moderation: {
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'flagged'],
      default: 'pending'
    },
    moderatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    moderatedAt: Date,
    reason: String
  },
  
  // Verification
  verified: {
    type: Boolean,
    default: false
  },
  
  // Helpfulness
  helpfulness: {
    helpful: { type: Number, default: 0 },
    notHelpful: { type: Number, default: 0 }
  },
  
  // Property Response
  propertyResponse: {
    response: String,
    respondedAt: Date,
    respondedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  
  // Visibility
  isVisible: {
    type: Boolean,
    default: true
  }
  
}, {
  timestamps: true
});

// Indexes
reviewSchema.index({ propertyId: 1, 'moderation.status': 1 });
reviewSchema.index({ userId: 1 });
reviewSchema.index({ bookingId: 1 }, { unique: true });
reviewSchema.index({ 'ratings.overall': -1 });

module.exports = mongoose.model('Review', reviewSchema);
