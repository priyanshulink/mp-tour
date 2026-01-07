const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  // Basic Information
  propertyId: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['homestay', 'hotel', 'resort', 'heritage', 'eco-lodge'],
    required: true
  },
  category: {
    type: String,
    enum: ['budget', 'standard', 'premium', 'luxury'],
    required: true
  },
  
  // Location Details
  location: {
    city: { type: String, required: true },
    district: { type: String, required: true },
    state: { type: String, default: 'Madhya Pradesh' },
    tourismCircuit: {
      type: String,
      enum: ['Chambal', 'Bundelkhand', 'Mahakaushal', 'Malwa', 'Nimar', 'Vindhya']
    },
    address: { type: String, required: true },
    pincode: { type: String, required: true },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  
  // Property Details
  description: {
    short: { type: String, required: true, maxlength: 200 },
    detailed: { type: String, required: true }
  },
  images: [{
    url: String,
    caption: String,
    isPrimary: Boolean
  }],
  
  // Room & Capacity
  rooms: [{
    roomType: { type: String, required: true },
    capacity: { type: Number, required: true },
    totalRooms: { type: Number, required: true },
    basePrice: { type: Number, required: true },
    amenities: [String]
  }],
  totalCapacity: {
    type: Number,
    required: true
  },
  
  // Amenities & Features
  amenities: {
    basic: [String], // WiFi, AC, TV, etc.
    dining: [String], // Restaurant, Room Service, etc.
    activities: [String], // Trekking, Boating, etc.
    services: [String] // Laundry, Transport, etc.
  },
  
  // Pricing
  pricing: {
    basePrice: { type: Number, required: true },
    seasonalRates: [{
      season: { type: String, required: true }, // peak, offpeak, festival
      multiplier: { type: Number, default: 1 },
      startDate: Date,
      endDate: Date
    }],
    weekendMultiplier: { type: Number, default: 1.2 },
    taxes: {
      gst: { type: Number, default: 12 }, // percentage
      tourismFee: { type: Number, default: 0 }
    }
  },
  
  // Policies
  policies: {
    checkIn: { type: String, default: '14:00' },
    checkOut: { type: String, default: '11:00' },
    cancellation: {
      fullRefund: { type: Number, default: 7 }, // days before check-in
      partialRefund: { type: Number, default: 3 },
      refundPercentage: { type: Number, default: 50 },
      noRefund: { type: Number, default: 1 }
    },
    rules: [String], // House rules, pet policy, etc.
    minStay: { type: Number, default: 1 },
    maxStay: { type: Number, default: 30 }
  },
  
  // Availability
  availability: {
    isActive: { type: Boolean, default: false },
    blockedDates: [{
      startDate: Date,
      endDate: Date,
      reason: String
    }]
  },
  
  // Owner Details
  owner: {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    contact: String,
    email: String,
    licenseNumber: String
  },
  
  // Admin Control
  approval: {
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'suspended'],
      default: 'pending'
    },
    verifiedAt: Date,
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    remarks: String
  },
  
  // Ratings & Reviews
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
    distribution: {
      5: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      1: { type: Number, default: 0 }
    }
  },
  
  // Statistics
  stats: {
    totalBookings: { type: Number, default: 0 },
    completedBookings: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    occupancyRate: { type: Number, default: 0 }
  },
  
  // Meta
  featured: { type: Boolean, default: false },
  verified: { type: Boolean, default: false },
  tags: [String],
  
}, {
  timestamps: true
});

// Indexes for better query performance
propertySchema.index({ 'location.city': 1, type: 1 });
propertySchema.index({ 'approval.status': 1 });
propertySchema.index({ 'availability.isActive': 1 });
propertySchema.index({ 'pricing.basePrice': 1 });
propertySchema.index({ featured: -1, 'ratings.average': -1 });

// Virtual for primary image
propertySchema.virtual('primaryImage').get(function() {
  const primary = this.images.find(img => img.isPrimary);
  return primary ? primary.url : (this.images[0] ? this.images[0].url : null);
});

module.exports = mongoose.model('Property', propertySchema);
