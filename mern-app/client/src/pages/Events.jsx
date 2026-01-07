import React, { useState, useEffect } from 'react';
import { eventAPI } from '../services/api';
import Navbar from '../components/Navbar';
import FloatingChatbot from '../components/FloatingChatbot';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState('All');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await eventAPI.getAllEvents();
      // Sort events by date
      const sortedEvents = response.data.events.sort((a, b) => new Date(a.date) - new Date(b.date));
      setEvents(sortedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeason = (dateString) => {
    const month = new Date(dateString).getMonth(); // 0-11
    if (month >= 10 || month <= 1) return 'Winter'; // Nov, Dec, Jan, Feb
    if (month >= 2 && month <= 5) return 'Summer'; // Mar, Apr, May, Jun
    if (month >= 6 && month <= 9) return 'Monsoon'; // Jul, Aug, Sep, Oct
    return 'Other';
  };

  const filteredEvents = selectedSeason === 'All'
    ? events
    : events.filter(event => getSeason(event.date) === selectedSeason);

  const seasons = ['All', 'Winter', 'Summer', 'Monsoon'];

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: '80px', minHeight: '100vh', background: '#f5f5f5' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{ marginBottom: '15px', color: '#1f2937' }}>Experience MP Culture</h1>
            <p style={{ color: '#666', maxWidth: '600px', margin: '0 auto' }}>
              Discover the vibrant festivals and ceremonies of Madhya Pradesh throughout the year.
            </p>
          </div>

          {/* Season Filter */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '40px', flexWrap: 'wrap' }}>
            {seasons.map(season => (
              <button
                key={season}
                onClick={() => setSelectedSeason(season)}
                style={{
                  padding: '10px 25px',
                  borderRadius: '30px',
                  border: 'none',
                  background: selectedSeason === season ? '#ed1c24' : 'white',
                  color: selectedSeason === season ? 'white' : '#666',
                  cursor: 'pointer',
                  fontWeight: '600',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease'
                }}
              >
                {season}
              </button>
            ))}
          </div>

          {loading ? (
            <p style={{ textAlign: 'center' }}>Loading events...</p>
          ) : filteredEvents.length === 0 ? (
            <p style={{ textAlign: 'center' }}>No upcoming events found for this season.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
              {filteredEvents.map((event) => (
                <div key={event._id} style={{
                  background: 'white',
                  borderRadius: '15px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                  transition: 'transform 0.3s ease'
                }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  {event.image ? (
                    <img
                      src={event.image.startsWith('/img') ? event.image : `http://localhost:5000${event.image}`}
                      alt={event.title}
                      style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                    />
                  ) : (
                    // Placeholder based on type
                    <div style={{ width: '100%', height: '200px', background: '#ffe4e6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ed1c24', fontSize: '40px' }}>
                      📅
                    </div>
                  )}

                  <div style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                      <span style={{
                        background: '#fef2f2',
                        color: '#b91c1c',
                        padding: '4px 8px',
                        borderRadius: '5px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {event.type}
                      </span>
                      <span style={{ fontSize: '12px', color: '#666', fontWeight: '500' }}>
                        {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px', color: '#1f2937' }}>{event.title}</h3>

                    <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      📍 {event.monastery}
                    </p>

                    <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: '1.5' }}>
                      {event.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <FloatingChatbot />
    </>
  );
};

export default Events;
