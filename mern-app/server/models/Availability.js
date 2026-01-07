const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  // Property Reference
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  
  // Date
  date: {
    type: Date,
    required: true
  },
  
  // Room-wise Availability
  rooms: [{
    roomType: String,
    totalRooms: Number,
    availableRooms: Number,
    bookedRooms: Number,
    blockedRooms: Number,
    priceOverride: Number // Special price for this date
  }],
  
  // Overall Status
  totalCapacity: {
    type: Number,
    required: true
  },
  availableCapacity: {
    type: Number,
    required: true
  },
  
  // Pricing for the date
  pricing: {
    basePrice: Number,
    seasonalMultiplier: { type: Number, default: 1 },
    isWeekend: Boolean,
    isFestival: Boolean,
    finalPrice: Number
  },
  
  // Locks (for pending bookings)
  locks: [{
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    roomType: String,
    quantity: Number,
    lockedAt: Date,
    expiresAt: Date,
    status: {
      type: String,
      enum: ['active', 'expired', 'released', 'confirmed'],
      default: 'active'
    }
  }],
  
  // Block Status
  isBlocked: {
    type: Boolean,
    default: false
  },
  blockReason: String,
  
  // Metadata
  lastUpdated: {
    type: Date,
    default: Date.now
  }
  
}, {
  timestamps: true
});

// Compound index for unique date per property
availabilitySchema.index({ propertyId: 1, date: 1 }, { unique: true });
availabilitySchema.index({ date: 1 });
availabilitySchema.index({ propertyId: 1, date: 1, availableCapacity: 1 });

// Method to check if rooms are available
availabilitySchema.methods.isAvailable = function(roomType, quantity) {
  const room = this.rooms.find(r => r.roomType === roomType);
  if (!room) return false;
  return room.availableRooms >= quantity;
};

// Method to lock rooms for a booking
availabilitySchema.methods.lockRooms = function(bookingId, roomType, quantity, expiryMinutes = 15) {
  const room = this.rooms.find(r => r.roomType === roomType);
  if (!room || room.availableRooms < quantity) {
    throw new Error('Insufficient rooms available');
  }
  
  const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);
  
  this.locks.push({
    bookingId,
    roomType,
    quantity,
    lockedAt: new Date(),
    expiresAt,
    status: 'active'
  });
  
  room.availableRooms -= quantity;
  this.availableCapacity -= quantity;
  this.lastUpdated = new Date();
};

// Method to release locked rooms
availabilitySchema.methods.releaseRooms = function(bookingId) {
  const lock = this.locks.find(l => l.bookingId.toString() === bookingId.toString() && l.status === 'active');
  if (!lock) return;
  
  const room = this.rooms.find(r => r.roomType === lock.roomType);
  if (room) {
    room.availableRooms += lock.quantity;
    this.availableCapacity += lock.quantity;
  }
  
  lock.status = 'released';
  this.lastUpdated = new Date();
};

// Method to confirm booking and convert lock to confirmed
availabilitySchema.methods.confirmBooking = function(bookingId) {
  const lock = this.locks.find(l => l.bookingId.toString() === bookingId.toString() && l.status === 'active');
  if (!lock) return;
  
  const room = this.rooms.find(r => r.roomType === lock.roomType);
  if (room) {
    room.bookedRooms += lock.quantity;
  }
  
  lock.status = 'confirmed';
  this.lastUpdated = new Date();
};

// Static method to clean expired locks
availabilitySchema.statics.cleanExpiredLocks = async function() {
  const now = new Date();
  const result = await this.updateMany(
    { 'locks.status': 'active', 'locks.expiresAt': { $lt: now } },
    { 
      $set: { 'locks.$[elem].status': 'expired' }
    },
    {
      arrayFilters: [{ 'elem.status': 'active', 'elem.expiresAt': { $lt: now } }]
    }
  );
  
  // Release the rooms
  const docs = await this.find({ 'locks.status': 'expired' });
  for (const doc of docs) {
    const expiredLocks = doc.locks.filter(l => l.status === 'expired');
    for (const lock of expiredLocks) {
      const room = doc.rooms.find(r => r.roomType === lock.roomType);
      if (room) {
        room.availableRooms += lock.quantity;
        doc.availableCapacity += lock.quantity;
      }
    }
    await doc.save();
  }
  
  return result;
};

module.exports = mongoose.model('Availability', availabilitySchema);
