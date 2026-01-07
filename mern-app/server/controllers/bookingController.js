const Booking = require('../models/Booking');
const Property = require('../models/Property');
const Availability = require('../models/Availability');
const Payment = require('../models/Payment');
const Cancellation = require('../models/Cancellation');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res) => {
  try {
    const {
      propertyId,
      checkIn,
      checkOut,
      guestDetails,
      rooms
    } = req.body;

    // Validate property
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    if (property.approval.status !== 'approved' || !property.availability.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Property is not available for booking'
      });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Validate dates
    if (checkInDate >= checkOutDate) {
      return res.status(400).json({
        success: false,
        message: 'Check-out date must be after check-in date'
      });
    }

    if (checkInDate < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Check-in date cannot be in the past'
      });
    }

    // Check availability and lock inventory
    const { available, availabilityDocs } = await checkAndLockAvailability(
      propertyId,
      checkInDate,
      checkOutDate,
      rooms
    );

    if (!available) {
      return res.status(400).json({
        success: false,
        message: 'Property is not available for selected dates'
      });
    }

    // Calculate pricing
    const pricing = await calculateDetailedPricing(
      property,
      checkInDate,
      checkOutDate,
      rooms
    );

    // Create booking
    const booking = await Booking.create({
      userId: req.user._id,
      propertyId,
      guestDetails,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      rooms,
      totalRooms: rooms.reduce((sum, r) => sum + r.quantity, 0),
      pricing,
      status: 'initiated',
      inventoryLock: {
        isLocked: true,
        lockedAt: new Date(),
        expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
      },
      source: req.headers['user-agent']?.includes('Mobile') ? 'mobile' : 'web',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    // Lock rooms in availability
    for (const availDoc of availabilityDocs) {
      for (const room of rooms) {
        availDoc.lockRooms(booking._id, room.roomType, room.quantity, 15);
      }
      await availDoc.save();
    }

    res.status(201).json({
      success: true,
      message: 'Booking initiated successfully',
      data: booking,
      expiresIn: 900 // seconds (15 minutes)
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating booking',
      error: error.message
    });
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('propertyId', 'name location images')
      .populate('userId', 'name email phone')
      .populate('paymentId');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check authorization
    if (req.user.role !== 'admin' && booking.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking'
      });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching booking',
      error: error.message
    });
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings/user/my-bookings
// @access  Private
exports.getUserBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = { userId: req.user._id };
    if (status) query.status = status;

    const bookings = await Booking.find(query)
      .populate('propertyId', 'name location images type')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      count: bookings.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: bookings
    });
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message
    });
  }
};

// @desc    Confirm booking after payment
// @route   PUT /api/bookings/:id/confirm
// @access  Private
exports.confirmBooking = async (req, res) => {
  try {
    const { paymentId } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Verify payment
    const payment = await Payment.findById(paymentId);
    if (!payment || payment.status !== 'success') {
      return res.status(400).json({
        success: false,
        message: 'Invalid or unsuccessful payment'
      });
    }

    // Update booking status
    booking.status = 'confirmed';
    booking.paymentId = paymentId;
    booking.paymentStatus = 'completed';
    booking.inventoryLock.isLocked = false;
    booking.notifications.confirmationSent = false;
    await booking.save();

    // Confirm booking in availability (convert lock to confirmed)
    const dates = getDateRange(booking.checkIn, booking.checkOut);
    for (const date of dates) {
      const availDoc = await Availability.findOne({
        propertyId: booking.propertyId,
        date: {
          $gte: new Date(date.setHours(0, 0, 0, 0)),
          $lt: new Date(date.setHours(23, 59, 59, 999))
        }
      });
      
      if (availDoc) {
        availDoc.confirmBooking(booking._id);
        await availDoc.save();
      }
    }

    // Update property stats
    await Property.findByIdAndUpdate(booking.propertyId, {
      $inc: { 'stats.totalBookings': 1, 'stats.totalRevenue': booking.pricing.totalAmount }
    });

    // Send confirmation email (implement email service)
    // await sendBookingConfirmation(booking);

    res.json({
      success: true,
      message: 'Booking confirmed successfully',
      data: booking
    });
  } catch (error) {
    console.error('Confirm booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error confirming booking',
      error: error.message
    });
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res) => {
  try {
    const { reason } = req.body;

    const booking = await Booking.findById(req.params.id).populate('propertyId');
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check authorization
    if (req.user.role !== 'admin' && booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    // Check if cancellation is allowed
    if (['cancelled', 'completed', 'checked-out'].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel booking with status: ${booking.status}`
      });
    }

    // Create cancellation record
    const cancellation = new Cancellation({
      bookingId: booking._id,
      userId: booking.userId,
      propertyId: booking.propertyId,
      paymentId: booking.paymentId,
      cancelledBy: req.user.role === 'admin' ? 'admin' : 'user',
      bookingDetails: {
        bookingId: booking.bookingId,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        nights: booking.nights,
        totalAmount: booking.pricing.totalAmount
      },
      reason: {
        category: req.body.category || 'user-request',
        description: reason
      }
    });

    // Calculate refund
    const refundAmount = cancellation.calculateRefund(
      booking.checkIn,
      booking.pricing.totalAmount,
      booking.propertyId.policies.cancellation
    );

    await cancellation.save();

    // Update booking status
    booking.status = 'cancelled';
    booking.cancellation = {
      isCancelled: true,
      cancelledAt: new Date(),
      cancelledBy: req.user.role === 'admin' ? 'admin' : 'user',
      reason,
      refundAmount,
      refundStatus: refundAmount > 0 ? 'pending' : 'not-applicable'
    };
    await booking.save();

    // Release inventory
    const dates = getDateRange(booking.checkIn, booking.checkOut);
    for (const date of dates) {
      const availDoc = await Availability.findOne({
        propertyId: booking.propertyId,
        date: {
          $gte: new Date(date.setHours(0, 0, 0, 0)),
          $lt: new Date(date.setHours(23, 59, 59, 999))
        }
      });
      
      if (availDoc) {
        availDoc.releaseRooms(booking._id);
        await availDoc.save();
      }
    }

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: {
        booking,
        cancellation,
        refundAmount
      }
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling booking',
      error: error.message
    });
  }
};

// @desc    Check-in booking
// @route   PUT /api/bookings/:id/check-in
// @access  Private (Admin/Property Owner)
exports.checkIn = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.status !== 'confirmed') {
      return res.status(400).json({
        success: false,
        message: 'Only confirmed bookings can be checked in'
      });
    }

    booking.status = 'checked-in';
    booking.checkInDetails = {
      actualCheckIn: new Date(),
      checkedInBy: req.user.name,
      verificationDone: true
    };
    await booking.save();

    res.json({
      success: true,
      message: 'Check-in successful',
      data: booking
    });
  } catch (error) {
    console.error('Check-in error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing check-in',
      error: error.message
    });
  }
};

// @desc    Check-out booking
// @route   PUT /api/bookings/:id/check-out
// @access  Private (Admin/Property Owner)
exports.checkOut = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.status !== 'checked-in') {
      return res.status(400).json({
        success: false,
        message: 'Only checked-in bookings can be checked out'
      });
    }

    booking.status = 'checked-out';
    booking.checkOutDetails = {
      actualCheckOut: new Date(),
      checkedOutBy: req.user.name,
      feedbackProvided: false
    };
    await booking.save();

    // Update property stats
    await Property.findByIdAndUpdate(booking.propertyId, {
      $inc: { 'stats.completedBookings': 1 }
    });

    res.json({
      success: true,
      message: 'Check-out successful',
      data: booking
    });
  } catch (error) {
    console.error('Check-out error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing check-out',
      error: error.message
    });
  }
};

// Helper Functions

async function checkAndLockAvailability(propertyId, checkIn, checkOut, rooms) {
  const dates = getDateRange(checkIn, checkOut);
  const availabilityDocs = [];

  for (const date of dates) {
    const availDoc = await Availability.findOne({
      propertyId,
      date: {
        $gte: new Date(date.setHours(0, 0, 0, 0)),
        $lt: new Date(date.setHours(23, 59, 59, 999))
      }
    });

    if (!availDoc || availDoc.isBlocked) {
      return { available: false, availabilityDocs: [] };
    }

    // Check if required rooms are available
    for (const room of rooms) {
      if (!availDoc.isAvailable(room.roomType, room.quantity)) {
        return { available: false, availabilityDocs: [] };
      }
    }

    availabilityDocs.push(availDoc);
  }

  return { available: true, availabilityDocs };
}

function getDateRange(startDate, endDate) {
  const dates = [];
  const currentDate = new Date(startDate);

  while (currentDate < endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

async function calculateDetailedPricing(property, checkIn, checkOut, rooms) {
  const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  
  let baseAmount = 0;
  let seasonalCharge = 0;
  let weekendCharge = 0;

  for (const roomBooking of rooms) {
    const room = property.rooms.find(r => r.roomType === roomBooking.roomType);
    if (!room) continue;

    const roomBasePrice = room.basePrice * roomBooking.quantity * nights;
    baseAmount += roomBasePrice;

    // Calculate seasonal and weekend charges for each night
    const currentDate = new Date(checkIn);
    for (let i = 0; i < nights; i++) {
      const day = currentDate.getDay();
      const isWeekend = (day === 0 || day === 6);
      
      if (isWeekend) {
        weekendCharge += room.basePrice * roomBooking.quantity * (property.pricing.weekendMultiplier - 1);
      }
      
      // Check seasonal rates
      for (const seasonal of property.pricing.seasonalRates) {
        if (currentDate >= seasonal.startDate && currentDate <= seasonal.endDate) {
          seasonalCharge += room.basePrice * roomBooking.quantity * (seasonal.multiplier - 1);
        }
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  const subtotal = baseAmount + seasonalCharge + weekendCharge;
  const gst = subtotal * (property.pricing.taxes.gst / 100);
  const tourismFee = property.pricing.taxes.tourismFee || 0;
  const totalAmount = Math.round(subtotal + gst + tourismFee);

  return {
    baseAmount: Math.round(baseAmount),
    seasonalCharge: Math.round(seasonalCharge),
    weekendCharge: Math.round(weekendCharge),
    subtotal: Math.round(subtotal),
    gst: Math.round(gst),
    tourismFee,
    discount: { amount: 0 },
    totalAmount
  };
}

module.exports = exports;
