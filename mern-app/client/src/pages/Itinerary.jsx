import React, { useState, useEffect } from 'react';
import { itineraryAPI } from '../services/api';
import Navbar from '../components/Navbar';
import FloatingChatbot from '../components/FloatingChatbot';
import { useAuth } from '../context/AuthContext';

const Itinerary = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('generate');
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  // Filter states
  const [filters, setFilters] = useState({
    days: 3,
    travel_experience: 'Cultural',
    budget_category: 'Medium',
    season: 'Spring',
    weather_condition: 'Clear',
    stay_type: 'Hotel',
    food_preference: 'Both',
    recommended_transport: 'Taxi'
  });

  const [generatedItinerary, setGeneratedItinerary] = useState(null);

  const filterOptions = {
    travel_experience: ['Cultural', 'Adventure', 'Spiritual', 'Photography', 'Nature', 'Heritage'],
    budget_category: ['Low', 'Medium', 'High', 'Luxury'],
    season: ['Spring', 'Summer', 'Monsoon', 'Autumn', 'Winter'],
    weather_condition: ['Sunny', 'Rainy', 'Cloudy', 'Snowy', 'Clear'],
    stay_type: ['Homestay', 'Hotel', 'Guesthouse', 'Resort', 'Budget Hotel'],
    food_preference: ['Veg', 'Non-Veg', 'Both', 'Vegan'],
    recommended_transport: ['Bus', 'Taxi', 'Private Car', 'Shared Jeep', 'Bike']
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const generateItinerary = async () => {
    if (!isAuthenticated()) {
      alert('Please login to generate itinerary');
      return;
    }

    setLoading(true);
    try {
      const response = await itineraryAPI.generateItinerary(filters);
      setGeneratedItinerary(response.data.itinerary);
      alert('Itinerary generated successfully!');
    } catch (error) {
      console.error('Error generating itinerary:', error);
      alert(error.response?.data?.message || 'Failed to generate itinerary');
    } finally {
      setLoading(false);
    }
  };

  const searchItineraries = async () => {
    setLoading(true);
    try {
      const response = await itineraryAPI.searchItineraries(filters);
      setSearchResults(response.data.itineraries);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to search itineraries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'browse') {
      searchItineraries();
    }
  }, [activeTab]);

  const downloadItinerary = () => {
    if (!generatedItinerary) return;

    const content = `
${generatedItinerary.monastery_name} - ${generatedItinerary.days} Day Itinerary
${'='.repeat(60)}

Destination: ${generatedItinerary.destination}
Travel Experience: ${generatedItinerary.travel_experience}
Budget Category: ${generatedItinerary.budget_category}
Season: ${generatedItinerary.season}
Weather: ${generatedItinerary.weather_condition}

Daily Cost: ₹${generatedItinerary.estimated_daily_cost_inr}
Total Estimated Cost: ₹${generatedItinerary.estimated_daily_cost_inr * generatedItinerary.days}

Transport: ${generatedItinerary.recommended_transport}
Stay Type: ${generatedItinerary.stay_type}
Food Preference: ${generatedItinerary.food_preference}

Activity: ${generatedItinerary.activity_type}

Day-wise Plan:
${generatedItinerary.daily_plan}

Notes:
${generatedItinerary.notes}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generatedItinerary.destination}-itinerary.txt`;
    a.click();
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <Navbar />

      <div style={{ paddingTop: '80px', paddingBottom: '60px', paddingLeft: '20px', paddingRight: '20px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1f2937', marginBottom: '10px' }}>
              Plan Your Heritage Journey
            </h1>
            <p style={{ fontSize: '18px', color: '#6b7280' }}>
              Create personalized itineraries based on your preferences
            </p>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px', gap: '10px' }}>
            <button
              onClick={() => setActiveTab('generate')}
              style={{
                padding: '12px 30px',
                fontSize: '16px',
                fontWeight: '600',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: activeTab === 'generate' ? '#8b5cf6' : '#e5e7eb',
                color: activeTab === 'generate' ? 'white' : '#4b5563',
                transition: 'all 0.3s'
              }}
            >
              Generate New
            </button>
            <button
              onClick={() => setActiveTab('browse')}
              style={{
                padding: '12px 30px',
                fontSize: '16px',
                fontWeight: '600',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: activeTab === 'browse' ? '#8b5cf6' : '#e5e7eb',
                color: activeTab === 'browse' ? 'white' : '#4b5563',
                transition: 'all 0.3s'
              }}
            >
              Browse Existing
            </button>
          </div>

          {/* Generate Tab */}
          {activeTab === 'generate' && (
            <div>
              {/* Filters Section */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '30px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                marginBottom: '30px'
              }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '20px' }}>
                  Select Your Preferences
                </h2>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '20px',
                  marginBottom: '20px'
                }}>
                  {/* Days */}
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                      Number of Days
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="14"
                      value={filters.days}
                      onChange={(e) => handleFilterChange('days', parseInt(e.target.value))}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        fontSize: '14px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  {/* Travel Experience */}
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                      Travel Experience
                    </label>
                    <select
                      value={filters.travel_experience}
                      onChange={(e) => handleFilterChange('travel_experience', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        fontSize: '14px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        outline: 'none',
                        backgroundColor: 'white'
                      }}
                    >
                      <option value="">Select...</option>
                      {filterOptions.travel_experience.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  {/* Budget Category */}
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                      Budget Category
                    </label>
                    <select
                      value={filters.budget_category}
                      onChange={(e) => handleFilterChange('budget_category', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        fontSize: '14px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        outline: 'none',
                        backgroundColor: 'white'
                      }}
                    >
                      <option value="">Select...</option>
                      {filterOptions.budget_category.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  {/* Season */}
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                      Season
                    </label>
                    <select
                      value={filters.season}
                      onChange={(e) => handleFilterChange('season', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        fontSize: '14px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        outline: 'none',
                        backgroundColor: 'white'
                      }}
                    >
                      <option value="">Select...</option>
                      {filterOptions.season.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  {/* Weather Condition */}
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                      Weather Condition
                    </label>
                    <select
                      value={filters.weather_condition}
                      onChange={(e) => handleFilterChange('weather_condition', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        fontSize: '14px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        outline: 'none',
                        backgroundColor: 'white'
                      }}
                    >
                      <option value="">Select...</option>
                      {filterOptions.weather_condition.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  {/* Stay Type */}
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                      Stay Type
                    </label>
                    <select
                      value={filters.stay_type}
                      onChange={(e) => handleFilterChange('stay_type', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        fontSize: '14px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        outline: 'none',
                        backgroundColor: 'white'
                      }}
                    >
                      <option value="">Select...</option>
                      {filterOptions.stay_type.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  {/* Food Preference */}
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                      Food Preference
                    </label>
                    <select
                      value={filters.food_preference}
                      onChange={(e) => handleFilterChange('food_preference', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        fontSize: '14px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        outline: 'none',
                        backgroundColor: 'white'
                      }}
                    >
                      <option value="">Select...</option>
                      {filterOptions.food_preference.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  {/* Transport */}
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                      Recommended Transport
                    </label>
                    <select
                      value={filters.recommended_transport}
                      onChange={(e) => handleFilterChange('recommended_transport', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        fontSize: '14px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        outline: 'none',
                        backgroundColor: 'white'
                      }}
                    >
                      <option value="">Select...</option>
                      {filterOptions.recommended_transport.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  onClick={generateItinerary}
                  disabled={loading}
                  style={{
                    padding: '12px 40px',
                    fontSize: '16px',
                    fontWeight: '600',
                    backgroundColor: loading ? '#9ca3af' : '#8b5cf6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s'
                  }}
                >
                  {loading ? 'Generating...' : 'Generate Itinerary'}
                </button>
              </div>

              {/* Generated Itinerary Display */}
              {generatedItinerary && (
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '30px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937' }}>
                      {generatedItinerary.monastery_name || 'Heritage Itinerary'}
                    </h2>
                    <button
                      onClick={downloadItinerary}
                      style={{
                        padding: '10px 24px',
                        fontSize: '14px',
                        fontWeight: '600',
                        backgroundColor: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      Download Itinerary
                    </button>
                  </div>

                  {/* Overview Cards */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '15px',
                    marginBottom: '30px'
                  }}>
                    <div style={{ backgroundColor: '#f3f4f6', padding: '15px', borderRadius: '8px' }}>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>Destination</div>
                      <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>{generatedItinerary.destination || 'N/A'}</div>
                    </div>
                    <div style={{ backgroundColor: '#f3f4f6', padding: '15px', borderRadius: '8px' }}>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>Duration</div>
                      <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>{generatedItinerary.days || 0} Days</div>
                    </div>
                    <div style={{ backgroundColor: '#f3f4f6', padding: '15px', borderRadius: '8px' }}>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>Budget</div>
                      <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>{generatedItinerary.budget_category || 'N/A'}</div>
                    </div>
                    <div style={{ backgroundColor: '#f3f4f6', padding: '15px', borderRadius: '8px' }}>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>Season</div>
                      <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>{generatedItinerary.season || 'N/A'}</div>
                    </div>
                    <div style={{ backgroundColor: '#f3f4f6', padding: '15px', borderRadius: '8px' }}>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>Daily Cost</div>
                      <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>₹{generatedItinerary.estimated_daily_cost_inr || 0}</div>
                    </div>
                    <div style={{ backgroundColor: '#f3f4f6', padding: '15px', borderRadius: '8px' }}>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>Total Cost</div>
                      <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>₹{(generatedItinerary.estimated_daily_cost_inr || 0) * (generatedItinerary.days || 0)}</div>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '20px',
                    marginBottom: '30px'
                  }}>
                    <div>
                      <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280', marginBottom: '8px' }}>Travel Experience</h3>
                      <p style={{ fontSize: '16px', color: '#1f2937' }}>{generatedItinerary.travel_experience || 'N/A'}</p>
                    </div>
                    <div>
                      <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280', marginBottom: '8px' }}>Weather</h3>
                      <p style={{ fontSize: '16px', color: '#1f2937' }}>{generatedItinerary.weather_condition || 'N/A'}</p>
                    </div>
                    <div>
                      <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280', marginBottom: '8px' }}>Stay Type</h3>
                      <p style={{ fontSize: '16px', color: '#1f2937' }}>{generatedItinerary.stay_type || 'N/A'}</p>
                    </div>
                    <div>
                      <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280', marginBottom: '8px' }}>Food Preference</h3>
                      <p style={{ fontSize: '16px', color: '#1f2937' }}>{generatedItinerary.food_preference || 'N/A'}</p>
                    </div>
                    <div>
                      <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280', marginBottom: '8px' }}>Transport</h3>
                      <p style={{ fontSize: '16px', color: '#1f2937' }}>{generatedItinerary.recommended_transport || 'N/A'}</p>
                    </div>
                    <div>
                      <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280', marginBottom: '8px' }}>Activity</h3>
                      <p style={{ fontSize: '16px', color: '#1f2937' }}>{generatedItinerary.activity_type || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Daily Plan */}
                  <div style={{ marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', marginBottom: '12px' }}>Day-wise Plan</h3>
                    <div style={{
                      backgroundColor: '#f9fafb',
                      padding: '20px',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb'
                    }}>
                      <pre style={{
                        fontFamily: 'inherit',
                        fontSize: '14px',
                        color: '#374151',
                        whiteSpace: 'pre-wrap',
                        lineHeight: '1.6',
                        margin: '0'
                      }}>
                        {generatedItinerary.daily_plan || 'No daily plan available'}
                      </pre>
                    </div>
                  </div>

                  {/* Notes */}
                  {generatedItinerary.notes && (
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', marginBottom: '12px' }}>Additional Notes</h3>
                      <div style={{
                        backgroundColor: '#fef3c7',
                        padding: '15px',
                        borderRadius: '8px',
                        border: '1px solid #fbbf24'
                      }}>
                        <p style={{ fontSize: '14px', color: '#92400e', margin: '0' }}>
                          {generatedItinerary.notes}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Browse Tab */}
          {activeTab === 'browse' && (
            <div>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '60px' }}>
                  <p style={{ fontSize: '18px', color: '#6b7280' }}>Loading itineraries...</p>
                </div>
              ) : searchResults.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', backgroundColor: 'white', borderRadius: '12px' }}>
                  <p style={{ fontSize: '18px', color: '#6b7280' }}>No itineraries found. Generate one to get started!</p>
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                  gap: '20px'
                }}>
                  {searchResults.map(item => (
                    <div
                      key={item._id}
                      style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        padding: '20px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                      }}
                    >
                      <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '10px' }}>
                        {item.monastery_name}
                      </h3>
                      <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '15px' }}>
                        {item.destination} • {item.days} Days
                      </p>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '15px' }}>
                        <span style={{
                          padding: '4px 12px',
                          fontSize: '12px',
                          backgroundColor: '#dbeafe',
                          color: '#1e40af',
                          borderRadius: '12px'
                        }}>
                          {item.travel_experience}
                        </span>
                        <span style={{
                          padding: '4px 12px',
                          fontSize: '12px',
                          backgroundColor: '#dcfce7',
                          color: '#166534',
                          borderRadius: '12px'
                        }}>
                          {item.budget_category}
                        </span>
                        <span style={{
                          padding: '4px 12px',
                          fontSize: '12px',
                          backgroundColor: '#fef3c7',
                          color: '#92400e',
                          borderRadius: '12px'
                        }}>
                          {item.season}
                        </span>
                      </div>

                      <div style={{ fontSize: '14px', color: '#374151', marginBottom: '10px' }}>
                        <strong>Daily Cost:</strong> ₹{item.estimated_daily_cost_inr}
                      </div>
                      <div style={{ fontSize: '14px', color: '#374151' }}>
                        <strong>Activity:</strong> {item.activity_type}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <FloatingChatbot />
    </div>
  );
};

export default Itinerary;
