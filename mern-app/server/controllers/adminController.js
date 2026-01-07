const Property = require('../models/Property');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const User = require('../models/User');
const Availability = require('../models/Availability');
const Cancellation = require('../models/Cancellation');

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
exports.getDashboardStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Get overall statistics
    const stats = await Promise.all([
      Property.countDocuments({ 'approval.status': 'approved' }),
      Property.countDocuments({ 'approval.status': 'pending' }),
      Booking.countDocuments({ status: 'confirmed', ...dateFilter }),
      Booking.countDocuments({ status: 'cancelled', ...dateFilter }),
      User.countDocuments({ role: 'user' }),
      Property.aggregate([
        { $match: { 'approval.status': 'approved' } },
        { $group: { _id: null, totalRevenue: { $sum: '$stats.totalRevenue' } } }
      ])
    ]);

    // Get booking trends (last 7 days)
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const bookingTrends = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: last7Days }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
          revenue: { $sum: '$pricing.totalAmount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Top performing properties
    const topProperties = await Property.find({ 'approval.status': 'approved' })
      .sort({ 'stats.totalBookings': -1 })
      .limit(5)
      .select('name location stats ratings');

    // Revenue by property type
    const revenueByType = await Property.aggregate([
      { $match: { 'approval.status': 'approved' } },
      {
        $group: {
          _id: '$type',
          totalRevenue: { $sum: '$stats.totalRevenue' },
          totalBookings: { $sum: '$stats.totalBookings' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Occupancy rate
    const totalCapacity = await Property.aggregate([
      { $match: { 'approval.status': 'approved', 'availability.isActive': true } },
      { $group: { _id: null, totalCapacity: { $sum: '$totalCapacity' } } }
    ]);

    const confirmedBookings = await Booking.countDocuments({
      status: { $in: ['confirmed', 'checked-in'] },
      checkIn: { $lte: new Date() },
      checkOut: { $gte: new Date() }
    });

    const occupancyRate = totalCapacity[0]
      ? ((confirmedBookings / totalCapacity[0].totalCapacity) * 100).toFixed(2)
      : 0;

    res.json({
      success: true,
      data: {
        overview: {
          totalProperties: stats[0],
          pendingApprovals: stats[1],
          totalBookings: stats[2],
          cancelledBookings: stats[3],
          totalUsers: stats[4],
          totalRevenue: stats[5][0]?.totalRevenue || 0,
          occupancyRate: Number(occupancyRate)
        },
        bookingTrends,
        topProperties,
        revenueByType,
        currentOccupancy: {
          occupied: confirmedBookings,
          total: totalCapacity[0]?.totalCapacity || 0
        }
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message
    });
  }
};

// @desc    Get all bookings (Admin view)
// @route   GET /api/admin/bookings
// @access  Private (Admin)
exports.getAllBookings = async (req, res) => {
  try {
    const {
      status,
      propertyId,
      startDate,
      endDate,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    const query = {};
    if (status) query.status = status;
    if (propertyId) query.propertyId = propertyId;
    if (startDate || endDate) {
      query.checkIn = {};
      if (startDate) query.checkIn.$gte = new Date(startDate);
      if (endDate) query.checkIn.$lte = new Date(endDate);
    }

    const sort = {};
    sort[sortBy] = order === 'desc' ? -1 : 1;

    const bookings = await Booking.find(query)
      .populate('userId', 'name email phone')
      .populate('propertyId', 'name location type')
      .populate('paymentId', 'status amount')
      .sort(sort)
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
    console.error('Get all bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message
    });
  }
};

// @desc    Approve property
// @route   PUT /api/admin/properties/:id/approve
// @access  Private (Admin)
exports.approveProperty = async (req, res) => {
  try {
    const { remarks } = req.body;

    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    property.approval.status = 'approved';
    property.approval.verifiedAt = new Date();
    property.approval.verifiedBy = req.user._id;
    property.approval.remarks = remarks;
    property.availability.isActive = true;
    property.verified = true;

    await property.save();

    res.json({
      success: true,
      message: 'Property approved successfully',
      data: property
    });
  } catch (error) {
    console.error('Approve property error:', error);
    res.status(500).json({
      success: false,
      message: 'Error approving property',
      error: error.message
    });
  }
};

// @desc    Reject property
// @route   PUT /api/admin/properties/:id/reject
// @access  Private (Admin)
exports.rejectProperty = async (req, res) => {
  try {
    const { remarks } = req.body;

    if (!remarks) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required'
      });
    }

    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    property.approval.status = 'rejected';
    property.approval.verifiedAt = new Date();
    property.approval.verifiedBy = req.user._id;
    property.approval.remarks = remarks;
    property.availability.isActive = false;

    await property.save();

    res.json({
      success: true,
      message: 'Property rejected',
      data: property
    });
  } catch (error) {
    console.error('Reject property error:', error);
    res.status(500).json({
      success: false,
      message: 'Error rejecting property',
      error: error.message
    });
  }
};

// @desc    Update property availability
// @route   PUT /api/admin/properties/:id/availability
// @access  Private (Admin/Owner)
exports.updateAvailability = async (req, res) => {
  try {
    const { startDate, endDate, isBlocked, reason, roomUpdates } = req.body;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required'
      });
    }

    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Update availability for date range
    const dates = [];
    const current = new Date(startDate);
    const end = new Date(endDate);

    while (current <= end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    for (const date of dates) {
      const availDoc = await Availability.findOne({
        propertyId: req.params.id,
        date: {
          $gte: new Date(date.setHours(0, 0, 0, 0)),
          $lt: new Date(date.setHours(23, 59, 59, 999))
        }
      });

      if (availDoc) {
        if (isBlocked !== undefined) {
          availDoc.isBlocked = isBlocked;
          availDoc.blockReason = reason;
        }

        if (roomUpdates) {
          for (const update of roomUpdates) {
            const room = availDoc.rooms.find(r => r.roomType === update.roomType);
            if (room && update.priceOverride !== undefined) {
              room.priceOverride = update.priceOverride;
            }
          }
        }

        await availDoc.save();
      }
    }

    res.json({
      success: true,
      message: 'Availability updated successfully'
    });
  } catch (error) {
    console.error('Update availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating availability',
      error: error.message
    });
  }
};

// @desc    Get revenue report
// @route   GET /api/admin/reports/revenue
// @access  Private (Admin)
exports.getRevenueReport = async (req, res) => {
  try {
    const { startDate, endDate, propertyId, groupBy = 'day' } = req.query;

    const matchQuery = {
      status: 'confirmed',
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    };

    if (propertyId) {
      matchQuery.propertyId = propertyId;
    }

    // Determine grouping format
    let groupFormat;
    switch (groupBy) {
      case 'month':
        groupFormat = '%Y-%m';
        break;
      case 'week':
        groupFormat = '%Y-W%V';
        break;
      default:
        groupFormat = '%Y-%m-%d';
    }

    const revenueData = await Booking.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: { $dateToString: { format: groupFormat, date: '$createdAt' } },
          totalRevenue: { $sum: '$pricing.totalAmount' },
          totalBookings: { $sum: 1 },
          averageBookingValue: { $avg: '$pricing.totalAmount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Property-wise breakdown
    const propertyBreakdown = await Booking.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$propertyId',
          totalRevenue: { $sum: '$pricing.totalAmount' },
          totalBookings: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'properties',
          localField: '_id',
          foreignField: '_id',
          as: 'property'
        }
      },
      { $unwind: '$property' },
      {
        $project: {
          propertyName: '$property.name',
          propertyType: '$property.type',
          totalRevenue: 1,
          totalBookings: 1
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    // Calculate summary
    const summary = {
      totalRevenue: revenueData.reduce((sum, item) => sum + item.totalRevenue, 0),
      totalBookings: revenueData.reduce((sum, item) => sum + item.totalBookings, 0),
      averageBookingValue: 0
    };
    summary.averageBookingValue = summary.totalBookings > 0
      ? summary.totalRevenue / summary.totalBookings
      : 0;

    res.json({
      success: true,
      data: {
        summary,
        timeline: revenueData,
        propertyBreakdown
      }
    });
  } catch (error) {
    console.error('Revenue report error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating revenue report',
      error: error.message
    });
  }
};

// @desc    Get occupancy report
// @route   GET /api/admin/reports/occupancy
// @access  Private (Admin)
exports.getOccupancyReport = async (req, res) => {
  try {
    const { startDate, endDate, propertyId } = req.query;

    const matchQuery = {
      checkIn: { $gte: new Date(startDate) },
      checkOut: { $lte: new Date(endDate) },
      status: { $in: ['confirmed', 'checked-in', 'checked-out', 'completed'] }
    };

    if (propertyId) {
      matchQuery.propertyId = propertyId;
    }

    const occupancyData = await Booking.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$propertyId',
          totalNights: { $sum: '$nights' },
          totalBookings: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'properties',
          localField: '_id',
          foreignField: '_id',
          as: 'property'
        }
      },
      { $unwind: '$property' },
      {
        $project: {
          propertyName: '$property.name',
          propertyType: '$property.type',
          totalCapacity: '$property.totalCapacity',
          totalNights: 1,
          totalBookings: 1,
          availableNights: {
            $multiply: [
              '$property.totalCapacity',
              {
                $divide: [
                  { $subtract: [new Date(endDate), new Date(startDate)] },
                  1000 * 60 * 60 * 24
                ]
              }
            ]
          }
        }
      },
      {
        $addFields: {
          occupancyRate: {
            $multiply: [
              { $divide: ['$totalNights', '$availableNights'] },
              100
            ]
          }
        }
      },
      { $sort: { occupancyRate: -1 } }
    ]);

    res.json({
      success: true,
      data: occupancyData
    });
  } catch (error) {
    console.error('Occupancy report error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating occupancy report',
      error: error.message
    });
  }
};

// @desc    Manage cancellations
// @route   GET /api/admin/cancellations
// @access  Private (Admin)
exports.getCancellations = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const query = {};
    if (status) query['refund.status'] = status;

    const cancellations = await Cancellation.find(query)
      .populate('bookingId', 'bookingId checkIn checkOut')
      .populate('userId', 'name email phone')
      .populate('propertyId', 'name')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((page - 1) * limit);

    const total = await Cancellation.countDocuments(query);

    res.json({
      success: true,
      count: cancellations.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: cancellations
    });
  } catch (error) {
    console.error('Get cancellations error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching cancellations',
      error: error.message
    });
  }
};

// @desc    Approve refund
// @route   PUT /api/admin/cancellations/:id/approve-refund
// @access  Private (Admin)
exports.approveRefund = async (req, res) => {
  try {
    const cancellation = await Cancellation.findById(req.params.id);
    if (!cancellation) {
      return res.status(404).json({
        success: false,
        message: 'Cancellation record not found'
      });
    }

    cancellation.refund.status = 'approved';
    cancellation.refund.approvedBy = req.user._id;
    cancellation.refund.approvedAt = new Date();
    cancellation.adminReview.reviewed = true;
    cancellation.adminReview.reviewedBy = req.user._id;
    cancellation.adminReview.reviewedAt = new Date();
    cancellation.adminReview.approved = true;

    await cancellation.save();

    res.json({
      success: true,
      message: 'Refund approved successfully',
      data: cancellation
    });
  } catch (error) {
    console.error('Approve refund error:', error);
    res.status(500).json({
      success: false,
      message: 'Error approving refund',
      error: error.message
    });
  }
};

module.exports = exports;
