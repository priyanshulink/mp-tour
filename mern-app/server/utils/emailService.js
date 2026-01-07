const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Send booking confirmation email
exports.sendBookingConfirmation = async (booking, property, user) => {
  try {
    const mailOptions = {
      from: `"Have-In-MP" <${process.env.SMTP_FROM}>`,
      to: user.email,
      subject: `Booking Confirmation - ${booking.bookingId}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #0066cc; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .booking-details { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #0066cc; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .btn { display: inline-block; padding: 10px 20px; background: #0066cc; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Booking Confirmed!</h1>
            </div>
            <div class="content">
              <h2>Dear ${user.name},</h2>
              <p>Your booking has been confirmed. Here are your booking details:</p>
              
              <div class="booking-details">
                <h3>Booking Information</h3>
                <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
                <p><strong>Property:</strong> ${property.name}</p>
                <p><strong>Location:</strong> ${property.location.city}, ${property.location.district}</p>
                <p><strong>Check-in:</strong> ${new Date(booking.checkIn).toLocaleDateString()}</p>
                <p><strong>Check-out:</strong> ${new Date(booking.checkOut).toLocaleDateString()}</p>
                <p><strong>Total Nights:</strong> ${booking.nights}</p>
                <p><strong>Total Amount:</strong> ₹${booking.pricing.totalAmount}</p>
              </div>
              
              <p>Please carry a valid ID proof at the time of check-in.</p>
              
              <a href="${process.env.FRONTEND_URL}/bookings/${booking._id}" class="btn">View Booking Details</a>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Have-In-MP. All rights reserved.</p>
              <p>For any queries, contact us at support@mptourism.gov.in</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Confirmation email sent to ${user.email}`);
  } catch (error) {
    console.error('Error sending confirmation email:', error);
  }
};

// Send cancellation email
exports.sendCancellationEmail = async (booking, user, cancellation) => {
  try {
    const mailOptions = {
      from: `"Have-In-MP" <${process.env.SMTP_FROM}>`,
      to: user.email,
      subject: `Booking Cancelled - ${booking.bookingId}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc3545; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .details { background: white; padding: 15px; margin: 15px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Booking Cancelled</h1>
            </div>
            <div class="content">
              <h2>Dear ${user.name},</h2>
              <p>Your booking has been cancelled.</p>
              
              <div class="details">
                <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
                <p><strong>Cancellation ID:</strong> ${cancellation.cancellationId}</p>
                <p><strong>Original Amount:</strong> ₹${cancellation.refund.originalAmount}</p>
                <p><strong>Refund Amount:</strong> ₹${cancellation.refund.refundableAmount}</p>
                <p><strong>Expected Refund Date:</strong> ${new Date(cancellation.refund.expectedCompletionDate).toLocaleDateString()}</p>
              </div>
              
              <p>The refund will be processed to your original payment method within 5-7 business days.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Have-In-MP. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Cancellation email sent to ${user.email}`);
  } catch (error) {
    console.error('Error sending cancellation email:', error);
  }
};

// Send check-in reminder
exports.sendCheckInReminder = async (booking, property, user) => {
  try {
    const mailOptions = {
      from: `"Have-In-MP" <${process.env.SMTP_FROM}>`,
      to: user.email,
      subject: `Check-in Tomorrow - ${booking.bookingId}`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>Check-in Reminder</h2>
            <p>Dear ${user.name},</p>
            <p>This is a reminder that your check-in is scheduled for tomorrow.</p>
            <div style="background: #f0f0f0; padding: 15px; margin: 15px 0;">
              <p><strong>Property:</strong> ${property.name}</p>
              <p><strong>Check-in Date:</strong> ${new Date(booking.checkIn).toLocaleDateString()}</p>
              <p><strong>Check-in Time:</strong> ${property.policies.checkIn}</p>
              <p><strong>Address:</strong> ${property.location.address}</p>
            </div>
            <p>Please remember to carry a valid ID proof.</p>
            <p>Have a wonderful stay!</p>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Check-in reminder sent to ${user.email}`);
  } catch (error) {
    console.error('Error sending check-in reminder:', error);
  }
};

module.exports = exports;
