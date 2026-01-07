import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/style.css';

const BookingCheckout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Try to get data from location.state first, then sessionStorage
  let bookingInfo = location.state || {};
  
  if (!bookingInfo.property) {
    console.log('No data in location.state, checking sessionStorage');
    const storedData = sessionStorage.getItem('bookingData');
    if (storedData) {
      bookingInfo = JSON.parse(storedData);
      console.log('Loaded data from sessionStorage');
    }
  }
  
  const { property, bookingData, selectedRoom, pricing } = bookingInfo;

  const [guestDetails, setGuestDetails] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    specialRequests: ''
  });
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('=== BOOKING CHECKOUT MOUNTED ===');
    console.log('Property:', property);
    console.log('Booking Data:', bookingData);
    console.log('Pricing:', pricing);
    
    // If no booking data, redirect back
    if (!property || !bookingData || !pricing) {
      console.log('ERROR: Missing required data');
      console.log('Property exists:', !!property);
      console.log('Booking Data exists:', !!bookingData);
      console.log('Pricing exists:', !!pricing);
      alert('Missing booking data. Please start booking process again.');
      navigate('/properties');
      return;
    }

    console.log('All data present, loading user details');
    // Load user details if available
    loadUserDetails();
  }, []);

  const loadUserDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await axios.get('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.success) {
          const user = response.data.data;
          setGuestDetails(prev => ({
            ...prev,
            fullName: user.name || '',
            email: user.email || '',
            phone: user.phone || ''
          }));
        }
      }
    } catch (error) {
      console.error('Error loading user details:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGuestDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!guestDetails.fullName.trim()) {
      setError('Full name is required');
      return false;
    }
    if (!guestDetails.email.trim() || !guestDetails.email.includes('@')) {
      setError('Valid email is required');
      return false;
    }
    if (!guestDetails.phone.trim() || guestDetails.phone.length < 10) {
      setError('Valid phone number is required (minimum 10 digits)');
      return false;
    }
    return true;
  };

  const handleConfirmBooking = async () => {
    setError(null);

    if (!validateForm()) {
      return;
    }

    setProcessing(true);

    try {
      const token = localStorage.getItem('token');
      
      console.log('=== CREATING BOOKING ===');
      console.log('Property ID:', property._id);
      console.log('Check-in:', bookingData.checkIn);
      console.log('Check-out:', bookingData.checkOut);
      
      // Create booking
      const bookingPayload = {
        propertyId: property._id,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        guestDetails: {
          name: guestDetails.fullName,
          email: guestDetails.email,
          phone: guestDetails.phone,
          address: guestDetails.address,
          adults: bookingData.guests.adults,
          children: bookingData.guests.children,
          specialRequests: guestDetails.specialRequests
        },
        rooms: [{
          roomType: selectedRoom.roomType,
          quantity: bookingData.roomQuantity,
          pricePerNight: selectedRoom.basePrice
        }]
      };

      console.log('Booking Payload:', JSON.stringify(bookingPayload, null, 2));

      const bookingResponse = await axios.post('/api/bookings', bookingPayload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Booking Response:', bookingResponse.data);
      const booking = bookingResponse.data.data;

      // Create payment order
      const paymentResponse = await axios.post('/api/payments/create-order', {
        bookingId: booking._id,
        amount: pricing.totalAmount
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const { orderId, keyId } = paymentResponse.data.data;

      // Initialize Razorpay
      const options = {
        key: keyId,
        amount: pricing.totalAmount * 100, // Amount in paise
        currency: 'INR',
        name: 'Have-In-MP',
        description: `Booking for ${property.name}`,
        order_id: orderId,
        handler: async function (response) {
          try {
            // Verify payment
            await axios.post('/api/payments/verify', {
              bookingId: booking._id,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            }, {
              headers: { Authorization: `Bearer ${token}` }
            });

            // Navigate to success page
            navigate('/booking/success', {
              state: {
                booking,
                property,
                message: 'Booking confirmed successfully!'
              }
            });
          } catch (error) {
            console.error('Payment verification failed:', error);
            setError('Payment verification failed. Please contact support.');
            setProcessing(false);
          }
        },
        prefill: {
          name: guestDetails.fullName,
          email: guestDetails.email,
          contact: guestDetails.phone
        },
        theme: {
          color: '#667eea'
        },
        modal: {
          ondismiss: function() {
            setProcessing(false);
            setError('Payment cancelled. Please try again.');
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Booking error:', error);
      setError(error.response?.data?.message || 'Failed to create booking. Please try again.');
      setProcessing(false);
    }
  };

  if (!property || !bookingData || !pricing) {
    return null;
  }

  const calculateNights = () => {
    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    return Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  };

  const nights = calculateNights();

  return (
    <div className="booking-checkout-container">
      <div className="checkout-content">
        <div className="checkout-main">
          <h1>Complete Your Booking</h1>

          {/* Booking Summary */}
          <div className="booking-summary-card">
            <h2>Booking Summary</h2>
            <div className="summary-item">
              <strong>Property:</strong>
              <span>{property.name}</span>
            </div>
            <div className="summary-item">
              <strong>Location:</strong>
              <span>{property.location.city}, {property.location.state}</span>
            </div>
            <div className="summary-item">
              <strong>Check-in:</strong>
              <span>{new Date(bookingData.checkIn).toLocaleDateString()}</span>
            </div>
            <div className="summary-item">
              <strong>Check-out:</strong>
              <span>{new Date(bookingData.checkOut).toLocaleDateString()}</span>
            </div>
            <div className="summary-item">
              <strong>Duration:</strong>
              <span>{nights} night{nights > 1 ? 's' : ''}</span>
            </div>
            <div className="summary-item">
              <strong>Room Type:</strong>
              <span>{selectedRoom.roomType}</span>
            </div>
            <div className="summary-item">
              <strong>Rooms:</strong>
              <span>{bookingData.roomQuantity}</span>
            </div>
            <div className="summary-item">
              <strong>Guests:</strong>
              <span>{bookingData.guests.adults} Adult{bookingData.guests.adults > 1 ? 's' : ''}, {bookingData.guests.children} Child{bookingData.guests.children !== 1 ? 'ren' : ''}</span>
            </div>
          </div>

          {/* Guest Details Form */}
          <div className="guest-details-card">
            <h2>Guest Details</h2>
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group">
              <label htmlFor="fullName">Full Name *</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={guestDetails.fullName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={guestDetails.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={guestDetails.phone}
                  onChange={handleInputChange}
                  placeholder="+91 9876543210"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address">Address</label>
              <textarea
                id="address"
                name="address"
                value={guestDetails.address}
                onChange={handleInputChange}
                placeholder="Enter your address"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label htmlFor="specialRequests">Special Requests (Optional)</label>
              <textarea
                id="specialRequests"
                name="specialRequests"
                value={guestDetails.specialRequests}
                onChange={handleInputChange}
                placeholder="Any special requests or requirements..."
                rows="4"
              />
            </div>
          </div>

          {/* Cancellation Policy */}
          <div className="policy-card">
            <h2>Cancellation Policy</h2>
            <ul>
              <li>Free cancellation up to 7 days before check-in</li>
              <li>50% refund for cancellations 3-7 days before check-in</li>
              <li>25% refund for cancellations 1-3 days before check-in</li>
              <li>No refund for cancellations within 24 hours of check-in</li>
            </ul>
          </div>
        </div>

        {/* Payment Summary Sidebar */}
        <div className="checkout-sidebar">
          <div className="price-card">
            <h2>Price Details</h2>
            
            <div className="price-breakdown">
              <div className="price-row">
                <span>Base Price ({nights} night{nights > 1 ? 's' : ''})</span>
                <span>₹{pricing.baseAmount?.toLocaleString()}</span>
              </div>

              {pricing.seasonalCharge > 0 && (
                <div className="price-row">
                  <span>Seasonal Charges</span>
                  <span>₹{pricing.seasonalCharge?.toLocaleString()}</span>
                </div>
              )}

              {pricing.weekendCharge > 0 && (
                <div className="price-row">
                  <span>Weekend Charges</span>
                  <span>₹{pricing.weekendCharge?.toLocaleString()}</span>
                </div>
              )}

              <div className="price-row">
                <span>GST ({pricing.gstRate}%)</span>
                <span>₹{pricing.gst?.toLocaleString()}</span>
              </div>

              <div className="price-row total">
                <span>Total Amount</span>
                <span>₹{pricing.totalAmount?.toLocaleString()}</span>
              </div>
            </div>

            <button 
              className="btn-confirm-booking"
              onClick={handleConfirmBooking}
              disabled={processing}
            >
              {processing ? 'Processing...' : 'Confirm & Pay'}
            </button>

            <div className="secure-payment">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
              </svg>
              <span>Secure payment powered by Razorpay</span>
            </div>
          </div>

          <div className="property-card-mini">
            <img src={property.images && property.images.length > 0 ? (property.images[0].url || property.images[0]) : '/img/placeholder.jpg'} alt={property.name} />
            <div className="property-info-mini">
              <h3>{property.name}</h3>
              <p>⭐ {property.ratings?.average || 'New'} ({property.ratings?.count || 0} reviews)</p>
              <p>📍 {property.location.city}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCheckout;
