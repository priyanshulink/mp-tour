const cron = require('node-cron');
const Booking = require('../models/Booking');
const Availability = require('../models/Availability');
const Payment = require('../models/Payment');

// Clean expired locks every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  try {
    console.log('Running expired locks cleanup...');
    
    // Clean expired locks in availability
    await Availability.cleanExpiredLocks();
    
    // Find and fail expired bookings
    const expiredBookings = await Booking.find({
      status: { $in: ['initiated', 'pending'] },
      'inventoryLock.expiresAt': { $lt: new Date() }
    });
    
    for (const booking of expiredBookings) {
      booking.status = 'failed';
      booking.inventoryLock.isLocked = false;
      await booking.save();
      
      console.log(`Booking ${booking.bookingId} marked as failed due to expiry`);
    }
    
    // Clean expired pending payments
    const expiredPayments = await Payment.find({
      status: 'created',
      expiresAt: { $lt: new Date() }
    });
    
    for (const payment of expiredPayments) {
      payment.status = 'failed';
      await payment.save();
      
      console.log(`Payment ${payment.paymentId} marked as failed due to expiry`);
    }
    
    console.log('Cleanup completed successfully');
  } catch (error) {
    console.error('Error in cleanup cron:', error);
  }
});

// Update booking status for completed stays (runs daily at 2 AM)
cron.schedule('0 2 * * *', async () => {
  try {
    console.log('Running booking status update...');
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(23, 59, 59, 999);
    
    const completedBookings = await Booking.updateMany(
      {
        status: 'checked-out',
        checkOut: { $lte: yesterday }
      },
      {
        $set: { status: 'completed' }
      }
    );
    
    console.log(`Updated ${completedBookings.modifiedCount} bookings to completed status`);
  } catch (error) {
    console.error('Error in status update cron:', error);
  }
});

// Send check-in reminders (runs daily at 10 AM)
cron.schedule('0 10 * * *', async () => {
  try {
    console.log('Sending check-in reminders...');
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const tomorrowEnd = new Date(tomorrow);
    tomorrowEnd.setHours(23, 59, 59, 999);
    
    const upcomingBookings = await Booking.find({
      status: 'confirmed',
      checkIn: { $gte: tomorrow, $lte: tomorrowEnd },
      'notifications.reminderSent': false
    }).populate('userId', 'email name');
    
    for (const booking of upcomingBookings) {
      // Send reminder email (implement email service)
      // await sendCheckInReminder(booking);
      
      booking.notifications.reminderSent = true;
      await booking.save();
      
      console.log(`Reminder sent for booking ${booking.bookingId}`);
    }
    
    console.log(`Sent reminders for ${upcomingBookings.length} bookings`);
  } catch (error) {
    console.error('Error in reminder cron:', error);
  }
});

// Generate daily reports (runs daily at 6 AM)
cron.schedule('0 6 * * *', async () => {
  try {
    console.log('Generating daily reports...');
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    
    const yesterdayEnd = new Date(yesterday);
    yesterdayEnd.setHours(23, 59, 59, 999);
    
    // Get yesterday's statistics
    const stats = await Promise.all([
      Booking.countDocuments({
        createdAt: { $gte: yesterday, $lte: yesterdayEnd }
      }),
      Booking.aggregate([
        {
          $match: {
            status: 'confirmed',
            createdAt: { $gte: yesterday, $lte: yesterdayEnd }
          }
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$pricing.totalAmount' }
          }
        }
      ])
    ]);
    
    console.log('Daily Report:', {
      date: yesterday.toISOString().split('T')[0],
      totalBookings: stats[0],
      totalRevenue: stats[1][0]?.totalRevenue || 0
    });
    
    // Store or email report as needed
  } catch (error) {
    console.error('Error in daily report cron:', error);
  }
});

console.log('Cron jobs initialized');

module.exports = {};
