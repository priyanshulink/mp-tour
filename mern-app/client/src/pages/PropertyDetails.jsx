import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import '../styles/style.css';
import '../styles/booking.css';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    guests: {
      adults: 2,
      children: 0
    },
    roomQuantity: 1
  });
  const [availability, setAvailability] = useState(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [pricing, setPricing] = useState(null);

  useEffect(() => {
    fetchPropertyDetails();
  }, [id]);

  const fetchPropertyDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/properties/${id}`);
      setProperty(response.data.data);
      if (response.data.data.rooms.length > 0) {
        setSelectedRoom(response.data.data.rooms[0]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching property:', error);
      setLoading(false);
    }
  };

  const handleCheckAvailability = async () => {
    if (!bookingData.checkIn || !bookingData.checkOut) {
      alert('Please select check-in and check-out dates');
      return;
    }

    try {
      setCheckingAvailability(true);
      const response = await axios.post(`/api/properties/${id}/check-availability`, {
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        guests: bookingData.guests.adults + bookingData.guests.children,
        roomType: selectedRoom?.roomType
      });

      setAvailability(response.data.available);
      if (response.data.available) {
        setPricing(response.data.pricing);
      }
      setCheckingAvailability(false);
    } catch (error) {
      console.error('Error checking availability:', error);
      alert('Error checking availability');
      setCheckingAvailability(false);
    }
  };

  const handleBookNow = () => {
    console.log('=== BOOK NOW CLICKED ===');
    console.log('Availability:', availability);
    
    if (!availability) {
      alert('Please check availability first');
      return;
    }

    const token = localStorage.getItem('token');
    console.log('Token check:', token ? 'EXISTS' : 'MISSING');
    
    if (!token) {
      console.log('No token - redirecting to login');
      window.location.href = '/login';
      return;
    }

    console.log('Has token - preparing navigation data');
    console.log('Property ID:', property?._id);
    console.log('Booking Data:', bookingData);
    console.log('Pricing:', pricing);
    
    // Store data in sessionStorage as backup
    sessionStorage.setItem('bookingData', JSON.stringify({
      property,
      bookingData,
      selectedRoom,
      pricing
    }));
    
    console.log('Data saved to sessionStorage');
    console.log('Attempting navigation to /booking/create');
    
    // Try both methods
    try {
      navigate('/booking/create', {
        state: {
          property,
          bookingData,
          selectedRoom,
          pricing
        }
      });
      console.log('Navigate called successfully');
    } catch (error) {
      console.error('Navigate error:', error);
      // Fallback to direct navigation
      window.location.href = '/booking/create';
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading property details...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="error-container">
        <h2>Property not found</h2>
        <button onClick={() => navigate('/properties')}>Back to Properties</button>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="property-details-container">
        {/* Image Gallery */}
      <div className="property-gallery">
        <div className="main-image">
          <img src={property.images && property.images.length > 0 ? (property.images[0].url || property.images[0]) : '/img/placeholder.jpg'} alt={property.name} />
        </div>
        <div className="thumbnail-images">
          {property.images.slice(0, 4).map((image, index) => (
            <img key={index} src={image.url || image} alt={image.caption || property.name} />
          ))}
        </div>
      </div>

      <div className="property-content">
        {/* Property Header */}
        <div className="property-header">
          <div className="header-left">
            <h1>{property.name}</h1>
            <div className="property-meta">
              <span className="property-type">{property.type} • {property.category}</span>
              {property.verified && <span className="verified-badge">✓ Verified by Have-In-MP</span>}
            </div>
            <div className="property-location">
              <i className="fas fa-map-marker-alt"></i>
              <span>{property.location.address}, {property.location.city}, {property.location.district}</span>
            </div>
            <div className="property-rating">
              <div className="stars">
                {'★'.repeat(Math.round(property.ratings.average))}
                {'☆'.repeat(5 - Math.round(property.ratings.average))}
              </div>
              <span>{property.ratings.average.toFixed(1)} ({property.ratings.count} reviews)</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="property-main">
          {/* Left Column - Details */}
          <div className="property-info">
            {/* Description */}
            <section className="info-section">
              <h2>About This Property</h2>
              <p>{property.description.detailed}</p>
            </section>

            {/* Rooms */}
            <section className="info-section">
              <h2>Rooms & Pricing</h2>
              <div className="rooms-list">
                {property.rooms.map((room, index) => (
                  <div 
                    key={index} 
                    className={`room-card ${selectedRoom?.roomType === room.roomType ? 'selected' : ''}`}
                    onClick={() => setSelectedRoom(room)}
                  >
                    <div className="room-info">
                      <h3>{room.roomType}</h3>
                      <p>Capacity: {room.capacity} guests</p>
                      <p>Available: {room.totalRooms} rooms</p>
                      <div className="room-amenities">
                        {room.amenities.map((amenity, i) => (
                          <span key={i} className="amenity-tag">{amenity}</span>
                        ))}
                      </div>
                    </div>
                    <div className="room-price">
                      <span className="price">₹{room.basePrice}</span>
                      <span className="unit">/night</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Amenities */}
            <section className="info-section">
              <h2>Amenities</h2>
              <div className="amenities-grid">
                <div>
                  <h4>Basic Amenities</h4>
                  <ul>
                    {property.amenities.basic.map((amenity, i) => (
                      <li key={i}><i className="fas fa-check"></i> {amenity}</li>
                    ))}
                  </ul>
                </div>
                {property.amenities.dining.length > 0 && (
                  <div>
                    <h4>Dining</h4>
                    <ul>
                      {property.amenities.dining.map((amenity, i) => (
                        <li key={i}><i className="fas fa-check"></i> {amenity}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {property.amenities.activities.length > 0 && (
                  <div>
                    <h4>Activities</h4>
                    <ul>
                      {property.amenities.activities.map((amenity, i) => (
                        <li key={i}><i className="fas fa-check"></i> {amenity}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>

            {/* Policies */}
            <section className="info-section">
              <h2>House Rules & Policies</h2>
              <div className="policies-grid">
                <div className="policy-item">
                  <strong>Check-in:</strong> {property.policies.checkIn}
                </div>
                <div className="policy-item">
                  <strong>Check-out:</strong> {property.policies.checkOut}
                </div>
                <div className="policy-item">
                  <strong>Minimum Stay:</strong> {property.policies.minStay} night(s)
                </div>
                <div className="policy-item">
                  <strong>Maximum Stay:</strong> {property.policies.maxStay} nights
                </div>
              </div>
              <div className="cancellation-policy">
                <h4>Cancellation Policy</h4>
                <ul>
                  <li>Full refund if cancelled {property.policies.cancellation.fullRefund}+ days before check-in</li>
                  <li>{property.policies.cancellation.refundPercentage}% refund if cancelled {property.policies.cancellation.partialRefund}+ days before check-in</li>
                  <li>No refund if cancelled within {property.policies.cancellation.noRefund} day of check-in</li>
                </ul>
              </div>
              {property.policies.rules.length > 0 && (
                <div className="house-rules">
                  <h4>House Rules</h4>
                  <ul>
                    {property.policies.rules.map((rule, i) => (
                      <li key={i}>{rule}</li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          </div>

          {/* Right Column - Booking Card */}
          <div className="booking-sidebar">
            <div className="booking-card">
              <h3>Book Your Stay</h3>
              
              <div className="booking-form">
                <div className="form-group">
                  <label>Check-in Date</label>
                  <input
                    type="date"
                    value={bookingData.checkIn}
                    onChange={(e) => setBookingData({...bookingData, checkIn: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="form-group">
                  <label>Check-out Date</label>
                  <input
                    type="date"
                    value={bookingData.checkOut}
                    onChange={(e) => setBookingData({...bookingData, checkOut: e.target.value})}
                    min={bookingData.checkIn || new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Adults</label>
                    <input
                      type="number"
                      min="1"
                      value={bookingData.guests.adults}
                      onChange={(e) => setBookingData({
                        ...bookingData,
                        guests: {...bookingData.guests, adults: parseInt(e.target.value)}
                      })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Children</label>
                    <input
                      type="number"
                      min="0"
                      value={bookingData.guests.children}
                      onChange={(e) => setBookingData({
                        ...bookingData,
                        guests: {...bookingData.guests, children: parseInt(e.target.value)}
                      })}
                    />
                  </div>
                </div>

                <button 
                  onClick={handleCheckAvailability}
                  disabled={checkingAvailability}
                  className="btn-check-availability"
                >
                  {checkingAvailability ? 'Checking...' : 'Check Availability'}
                </button>

                {availability !== null && (
                  <div className={`availability-result ${availability ? 'available' : 'unavailable'}`}>
                    {availability ? (
                      <>
                        <p className="availability-message">✓ Available for booking</p>
                        {pricing && (
                          <div className="price-breakdown">
                            <div className="price-row">
                              <span>Base Price ({pricing.nights} nights)</span>
                              <span>₹{pricing.baseAmount}</span>
                            </div>
                            {pricing.seasonalCharge > 0 && (
                              <div className="price-row">
                                <span>Seasonal Charge</span>
                                <span>₹{pricing.seasonalCharge}</span>
                              </div>
                            )}
                            {pricing.weekendCharge > 0 && (
                              <div className="price-row">
                                <span>Weekend Charge</span>
                                <span>₹{pricing.weekendCharge}</span>
                              </div>
                            )}
                            <div className="price-row">
                              <span>GST ({((pricing.gst / pricing.subtotal) * 100).toFixed(0)}%)</span>
                              <span>₹{pricing.gst}</span>
                            </div>
                            <div className="price-row total">
                              <span>Total Amount</span>
                              <span>₹{pricing.totalAmount}</span>
                            </div>
                          </div>
                        )}
                        <button 
                          onClick={handleBookNow} 
                          className="btn-book-now"
                          style={{
                            width: '100%',
                            marginTop: '15px',
                            padding: '14px',
                            backgroundColor: '#667eea',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            zIndex: 1000
                          }}
                        >
                          Book Now
                        </button>
                      </>
                    ) : (
                      <p className="availability-message">✗ Not available for selected dates</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Property Stats */}
            <div className="property-stats">
              <div className="stat-item">
                <i className="fas fa-hotel"></i>
                <div>
                  <strong>{property.stats.totalBookings}</strong>
                  <span>Total Bookings</span>
                </div>
              </div>
              <div className="stat-item">
                <i className="fas fa-chart-line"></i>
                <div>
                  <strong>{property.stats.occupancyRate}%</strong>
                  <span>Occupancy Rate</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default PropertyDetails;
