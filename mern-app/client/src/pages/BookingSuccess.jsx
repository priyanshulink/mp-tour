import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/style.css';

const BookingSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking, property, message } = location.state || {};

  if (!booking) {
    navigate('/properties');
    return null;
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="booking-success-container">
      <div className="success-content">
        <div className="success-icon">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>

        <h1>Booking Confirmed!</h1>
        <p className="success-message">{message || 'Your booking has been confirmed successfully.'}</p>

        <div className="booking-details-card">
          <h2>Booking Details</h2>
          
          <div className="detail-row">
            <span className="detail-label">Booking ID:</span>
            <span className="detail-value booking-id">{booking.bookingId}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Property:</span>
            <span className="detail-value">{property?.name || 'N/A'}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Location:</span>
            <span className="detail-value">
              {property?.location?.city}, {property?.location?.state}
            </span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Check-in:</span>
            <span className="detail-value">{formatDate(booking.checkIn)}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Check-out:</span>
            <span className="detail-value">{formatDate(booking.checkOut)}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Guests:</span>
            <span className="detail-value">
              {booking.guests?.adults || 0} Adults, {booking.guests?.children || 0} Children
            </span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Total Amount:</span>
            <span className="detail-value amount">₹{booking.totalAmount?.toLocaleString()}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Status:</span>
            <span className="status-badge confirmed">Confirmed</span>
          </div>
        </div>

        <div className="next-steps-card">
          <h2>What's Next?</h2>
          <ul className="next-steps-list">
            <li>
              <span className="step-icon">📧</span>
              <div>
                <strong>Confirmation Email</strong>
                <p>Check your email for booking confirmation and receipt</p>
              </div>
            </li>
            <li>
              <span className="step-icon">📱</span>
              <div>
                <strong>Get Details</strong>
                <p>Property contact details have been sent to your email</p>
              </div>
            </li>
            <li>
              <span className="step-icon">🗓️</span>
              <div>
                <strong>Arrival</strong>
                <p>Arrive on {formatDate(booking.checkIn)} after {property?.policies?.checkIn || '2:00 PM'}</p>
              </div>
            </li>
            <li>
              <span className="step-icon">💳</span>
              <div>
                <strong>Payment Confirmed</strong>
                <p>Your payment has been processed successfully</p>
              </div>
            </li>
          </ul>
        </div>

        <div className="action-buttons">
          <button 
            className="btn-primary"
            onClick={() => navigate('/user/bookings')}
          >
            View My Bookings
          </button>
          <button 
            className="btn-secondary"
            onClick={() => navigate('/properties')}
          >
            Browse More Properties
          </button>
          <button 
            className="btn-secondary"
            onClick={() => navigate('/')}
          >
            Go to Home
          </button>
        </div>

        <div className="support-info">
          <p>Need help? Contact us at:</p>
          <p>📞 <strong>+91-755-1234567</strong> | 📧 <strong>support@mptourism.com</strong></p>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
