import React, { useState } from 'react';
import { MapPin, Hospital, Home, UtensilsCrossed, X, Info, Mountain, ExternalLink } from 'lucide-react';
import Navbar from '../components/Navbar';
import FloatingChatbot from '../components/FloatingChatbot';

const monasteries = [
  {
    id: 1,
    name: "Khajuraho Temples",
    location: "Khajuraho, Chhatarpur District",
    description: "A UNESCO World Heritage Site famous for its nagara-style architectural symbolism and erotic sculptures.",
    image: "/img/khajuraho.png",
    coordinates: { lat: 24.8318, lng: 79.9199 },
    details: {
      founded: "950-1050 CE",
      elevation: "283 meters",
      significance: "Epitome of Chandela art",
      bestTime: "October to March"
    },
    nearby: {
      hospitals: [
        { name: "Civil Hospital Khajuraho", distance: "2 km", coordinates: { lat: 24.8400, lng: 79.9300 } },
        { name: "District Hospital Chhatarpur", distance: "45 km", coordinates: { lat: 24.9160, lng: 79.5866 } }
      ],
      hotels: [
        { name: "The Lalit Temple View", distance: "1 km", coordinates: { lat: 24.8350, lng: 79.9250 } },
        { name: "Radisson Jass Hotel", distance: "2 km", coordinates: { lat: 24.8380, lng: 79.9320 } },
        { name: "Hotel Chandela", distance: "1.5 km", coordinates: { lat: 24.8360, lng: 79.9280 } }
      ],
      restaurants: [
        { name: "Raja Cafe", distance: "0.5 km", coordinates: { lat: 24.8325, lng: 79.9210 } },
        { name: "Madra Cafe", distance: "1 km", coordinates: { lat: 24.8340, lng: 79.9240 } },
        { name: "La Terrazza", distance: "1.2 km", coordinates: { lat: 24.8345, lng: 79.9260 } }
      ]
    }
  },
  {
    id: 2,
    name: "Mahakaleshwar Temple",
    location: "Ujjain, Ujjain District",
    description: "One of the twelve Jyotirlingas, dedicated to Lord Shiva. Famous for its Bhasma Aarti.",
    image: "/img/mahakaleshwar.png",
    coordinates: { lat: 23.1827, lng: 75.7682 },
    details: {
      founded: "Ancient (Pre-historic)",
      elevation: "491 meters",
      significance: "One of the 12 Jyotirlingas",
      bestTime: "October to March"
    },
    nearby: {
      hospitals: [
        { name: "Civil Hospital Ujjain", distance: "1.5 km", coordinates: { lat: 23.1900, lng: 75.7750 } },
        { name: "Tejankar Hospital", distance: "2 km", coordinates: { lat: 23.1850, lng: 75.7800 } }
      ],
      hotels: [
        { name: "Hotel Imperial", distance: "1 km", coordinates: { lat: 23.1800, lng: 75.7700 } },
        { name: "Anjushree", distance: "3 km", coordinates: { lat: 23.1600, lng: 75.7900 } }
      ],
      restaurants: [
        { name: "Empire Restaurant", distance: "1.2 km", coordinates: { lat: 23.1810, lng: 75.7720 } },
        { name: "Shree Ganga", distance: "0.8 km", coordinates: { lat: 23.1830, lng: 75.7650 } }
      ]
    }
  },
  {
    id: 3,
    name: "Sanchi Stupa",
    location: "Sanchi, Raisen District",
    description: "One of the oldest stone structures in India, commissioned by Emperor Ashoka.",
    image: "/img/sanchi_stupa.png",
    coordinates: { lat: 23.4873, lng: 77.7418 },
    details: {
      founded: "3rd Century BCE",
      elevation: "462 meters",
      significance: "Buddhist Complex, UNESCO Site",
      bestTime: "July to March"
    },
    nearby: {
      hospitals: [
        { name: "Government Hospital Sanchi", distance: "1 km", coordinates: { lat: 23.4900, lng: 77.7450 } },
        { name: "Vidisha District Hospital", distance: "10 km", coordinates: { lat: 23.5300, lng: 77.8200 } }
      ],
      hotels: [
        { name: "MPT Gateway Retreat", distance: "0.5 km", coordinates: { lat: 23.4850, lng: 77.7400 } },
        { name: "Aaram Baagh", distance: "2 km", coordinates: { lat: 23.4800, lng: 77.7300 } }
      ],
      restaurants: [
        { name: "Gateway Cafeteria", distance: "0.5 km", coordinates: { lat: 23.4850, lng: 77.7400 } },
        { name: "Jain Restaurant", distance: "1 km", coordinates: { lat: 23.4880, lng: 77.7440 } }
      ]
    }
  },
  {
    id: 4,
    name: "Gwalior Fort",
    location: "Gwalior, Gwalior District",
    description: "A hill fort known as 'The Pearl of Fortresses', featuring palaces and temples.",
    image: "/img/gwalior_fort.png",
    coordinates: { lat: 26.2313, lng: 78.1695 },
    details: {
      founded: "8th Century CE",
      elevation: "244 meters",
      significance: "Architectural Marvel",
      bestTime: "October to March"
    },
    nearby: {
      hospitals: [
        { name: "J A Hospital", distance: "3 km", coordinates: { lat: 26.2100, lng: 78.1700 } },
        { name: "Bimr Hospitals", distance: "4 km", coordinates: { lat: 26.2200, lng: 78.1900 } }
      ],
      hotels: [
        { name: "Taj Usha Kiran Palace", distance: "2 km", coordinates: { lat: 26.2150, lng: 78.1800 } },
        { name: "Radisson Gwalior", distance: "3 km", coordinates: { lat: 26.2050, lng: 78.1950 } }
      ],
      restaurants: [
        { name: "Silver Saloon", distance: "2 km", coordinates: { lat: 26.2150, lng: 78.1800 } },
        { name: "Kwality Restaurant", distance: "3 km", coordinates: { lat: 26.2080, lng: 78.1650 } }
      ]
    }
  },
  {
    id: 5,
    name: "Omkareshwar Temple",
    location: "Omkareshwar, Khandwa District",
    description: "A Hindu temple dedicated to God Shiva, located on Mandhata island.",
    image: "/img/omkareshwar.png",
    coordinates: { lat: 22.2458, lng: 76.1487 },
    details: {
      founded: "Ancient",
      elevation: "260 meters",
      significance: "Jyotirlinga Shrine",
      bestTime: "July to March"
    },
    nearby: {
      hospitals: [
        { name: "Community Health Centre", distance: "2 km", coordinates: { lat: 22.2500, lng: 76.1550 } }
      ],
      hotels: [
        { name: "Narmada Resort", distance: "1 km", coordinates: { lat: 22.2480, lng: 76.1500 } },
        { name: "Hotel Shri Radhe", distance: "1.5 km", coordinates: { lat: 22.2520, lng: 76.1450 } }
      ],
      restaurants: [
        { name: "Geetashri Restaurant", distance: "0.5 km", coordinates: { lat: 22.2460, lng: 76.1490 } }
      ]
    }
  },
  {
    id: 6,
    name: "Orchha Fort Complex",
    location: "Orchha, Niwari District",
    description: "A complex located on an island in the Betwa River, founded by the Bundela chief Rudra Pratap Singh.",
    image: "/img/orchha_fort.png",
    coordinates: { lat: 25.3565, lng: 78.6441 },
    details: {
      founded: "16th Century",
      elevation: "220 meters",
      significance: "Bundela Architecture",
      bestTime: "October to March"
    },
    nearby: {
      hospitals: [
        { name: "Government Hospital Orchha", distance: "1 km", coordinates: { lat: 25.3580, lng: 78.6400 } }
      ],
      hotels: [
        { name: "Amar Mahal", distance: "0.5 km", coordinates: { lat: 25.3550, lng: 78.6460 } },
        { name: "Orchha Resort", distance: "0.8 km", coordinates: { lat: 25.3540, lng: 78.6480 } }
      ],
      restaurants: [
        { name: "Betwa Tarang", distance: "0.6 km", coordinates: { lat: 25.3570, lng: 78.6420 } },
        { name: "Rammaja Restaurant", distance: "0.3 km", coordinates: { lat: 25.3560, lng: 78.6430 } }
      ]
    }
  },
  {
    id: 7,
    name: "Bhimbetka Rock Shelters",
    location: "Bhimbetka, Raisen District",
    description: "An archaeological site that spans the prehistoric Paleolithic and Mesolithic periods.",
    image: "/img/bhimbetka.png",
    coordinates: { lat: 22.9372, lng: 77.6127 },
    details: {
      founded: "Paleolithic Age",
      elevation: "450 meters",
      significance: "Earliest human life in India",
      bestTime: "October to March"
    },
    nearby: {
      hospitals: [
        { name: "Obedullaganj Hospital", distance: "8 km", coordinates: { lat: 22.9800, lng: 77.6500 } }
      ],
      hotels: [
        { name: "MPT Highway Treat", distance: "5 km", coordinates: { lat: 22.9500, lng: 77.6200 } }
      ],
      restaurants: [
        { name: "Midway Treat", distance: "5 km", coordinates: { lat: 22.9500, lng: 77.6200 } }
      ]
    }
  },
  {
    id: 8,
    name: "Jahaz Mahal",
    location: "Mandu, Dhar District",
    description: "A palace that looks like a ship floating on water, built between two artificial lakes.",
    image: "/img/jahaz_mahal.png",
    coordinates: { lat: 22.3670, lng: 75.4045 },
    details: {
      founded: "15th Century",
      elevation: "633 meters",
      significance: "Afghan Architecture",
      bestTime: "July to March"
    },
    nearby: {
      hospitals: [
        { name: "Community Health Centre Mandu", distance: "2 km", coordinates: { lat: 22.3700, lng: 75.4000 } }
      ],
      hotels: [
        { name: "Malwa Resort", distance: "1.5 km", coordinates: { lat: 22.3600, lng: 75.4100 } },
        { name: "Jahaj Mahal Hotel", distance: "0.5 km", coordinates: { lat: 22.3680, lng: 75.4050 } }
      ],
      restaurants: [
        { name: "Shivani Restaurant", distance: "1 km", coordinates: { lat: 22.3650, lng: 75.4020 } }
      ]
    }
  },
  {
    id: 9,
    name: "Bhojpur Temple",
    location: "Bhojpur, Raisen District",
    description: "An incomplete Hindu temple dedicated to Shiva, famous for its massive Linga.",
    image: "/img/bhojpur_temple.png",
    coordinates: { lat: 23.0645, lng: 77.5819 },
    details: {
      founded: "11th Century",
      elevation: "450 meters",
      significance: "Cyclopean masonry",
      bestTime: "July to March"
    },
    nearby: {
      hospitals: [
        { name: "Bhopal Memorial Hospital", distance: "25 km", coordinates: { lat: 23.2800, lng: 77.4200 } }
      ],
      hotels: [
        { name: "Noor-Us-Sabah Palace", distance: "28 km", coordinates: { lat: 23.2900, lng: 77.3800 } }
      ],
      restaurants: [
        { name: "Bhojpur Retreat", distance: "0.2 km", coordinates: { lat: 23.0650, lng: 77.5810 } }
      ]
    }
  }
];

const Navigation = () => {
  const [selectedMonastery, setSelectedMonastery] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [mapType, setMapType] = useState('');

  const openDetails = (monastery) => {
    setSelectedMonastery(monastery);
    setShowMap(false);
  };

  const showNearbyPlaces = (type) => {
    setMapType(type);
    setShowMap(true);
  };

  const closeModal = () => {
    setSelectedMonastery(null);
    setShowMap(false);
  };

  const getGradientColor = (id) => {
    const colors = [
      'from-orange-400 to-red-500',
      'from-purple-400 to-pink-500',
      'from-blue-400 to-indigo-500',
      'from-green-400 to-teal-500',
      'from-yellow-400 to-orange-500',
      'from-red-400 to-pink-500',
      'from-indigo-400 to-purple-500',
      'from-teal-400 to-green-500',
      'from-pink-400 to-rose-500'
    ];
    return colors[id % colors.length];
  };

  const getGradientColors = (id) => {
    const colors = [
      { from: '#fb923c', to: '#ef4444' },
      { from: '#c084fc', to: '#ec4899' },
      { from: '#60a5fa', to: '#6366f1' },
      { from: '#4ade80', to: '#14b8a6' },
      { from: '#facc15', to: '#fb923c' },
      { from: '#f87171', to: '#ec4899' },
      { from: '#818cf8', to: '#a855f7' },
      { from: '#2dd4bf', to: '#22c55e' },
      { from: '#f9a8d4', to: '#fb7185' }
    ];
    return colors[id % colors.length];
  };

  const openInGoogleMaps = (placeName, coords) => {
    // If placeName is passed, search for that specific place, otherwise search for place type
    const query = typeof placeName === 'string' && placeName.includes(' ')
      ? encodeURIComponent(placeName)
      : encodeURIComponent(`${placeName} near ${coords.lat},${coords.lng}`);
    window.open(`https://www.google.com/maps/search/${query}/@${coords.lat},${coords.lng},14z`, '_blank');
  };

  const getStaticMapUrl = (coords) => {
    return `https://www.openstreetmap.org/export/embed.html?bbox=${coords.lng - 0.05},${coords.lat - 0.05},${coords.lng + 0.05},${coords.lat + 0.05}&layer=mapnik&marker=${coords.lat},${coords.lng}`;
  };

  return (
    <>
      <Navbar />
      <FloatingChatbot />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50" style={{ paddingTop: '80px', paddingBottom: '40px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px', paddingTop: '20px' }}>
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 'bold', color: '#78350f', marginBottom: '15px' }}>
              Explore Madhya Pradesh Heritage
            </h1>
            <p style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: '#92400e' }}>
              Discover the spiritual and historical wonders of the Heart of India
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px',
            marginBottom: '40px'
          }}>
            {monasteries.map((monastery) => (
              <div
                key={monastery.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                }}
              >
                <div style={{
                  position: 'relative',
                  height: '200px',
                  overflow: 'hidden'
                }}>
                  <img
                    src={monastery.image}
                    alt={monastery.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.3)' }}></div>
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)',
                    padding: '20px'
                  }}>
                    <h3 style={{ color: 'white', fontWeight: 'bold', fontSize: '1.25rem', margin: 0 }}>
                      {monastery.name}
                    </h3>
                  </div>
                </div>

                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '15px' }}>
                    <MapPin style={{ width: '16px', height: '16px', color: '#ef4444', marginRight: '8px', marginTop: '2px', flexShrink: 0 }} />
                    <p style={{ fontSize: '0.875rem', color: '#4b5563', margin: 0 }}>{monastery.location}</p>
                  </div>

                  <p style={{
                    color: '#374151',
                    fontSize: '0.875rem',
                    marginBottom: '20px',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: '1.5'
                  }}>
                    {monastery.description}
                  </p>

                  <button
                    onClick={() => openDetails(monastery)}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(to right, #d97706, #ea580c)',
                      color: 'white',
                      padding: '10px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(to right, #b45309, #c2410c)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(to right, #d97706, #ea580c)';
                    }}
                  >
                    <Info style={{ width: '16px', height: '16px' }} />
                    View More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedMonastery && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 9999
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              maxWidth: '900px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
            }}>
              <div style={{
                position: 'sticky',
                top: 0,
                background: 'linear-gradient(to right, #d97706, #ea580c)',
                color: 'white',
                padding: '24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                zIndex: 10
              }}>
                <div>
                  <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '8px' }}>{selectedMonastery.name}</h2>
                  <p style={{ color: '#fef3c7', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin style={{ width: '16px', height: '16px' }} />
                    {selectedMonastery.location}
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    borderRadius: '50%',
                    padding: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.3)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'}
                >
                  <X style={{ width: '24px', height: '24px' }} />
                </button>
              </div>

              {!showMap ? (
                <div style={{ padding: '24px' }}>
                  <div style={{
                    width: '100%',
                    height: '256px',
                    borderRadius: '12px',
                    marginBottom: '24px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <img
                      src={selectedMonastery.image}
                      alt={selectedMonastery.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.2)' }}></div>
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '12px' }}>About</h3>
                    <p style={{ color: '#374151', lineHeight: '1.75' }}>
                      {selectedMonastery.description}
                    </p>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '16px',
                    marginBottom: '24px',
                    backgroundColor: '#fffbeb',
                    padding: '16px',
                    borderRadius: '12px'
                  }}>
                    <div>
                      <p style={{ fontSize: '0.875rem', color: '#4b5563', fontWeight: '600' }}>Founded</p>
                      <p style={{ color: '#1f2937' }}>{selectedMonastery.details.founded}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.875rem', color: '#4b5563', fontWeight: '600' }}>Elevation</p>
                      <p style={{ color: '#1f2937' }}>{selectedMonastery.details.elevation}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.875rem', color: '#4b5563', fontWeight: '600' }}>Significance</p>
                      <p style={{ color: '#1f2937' }}>{selectedMonastery.details.significance}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.875rem', color: '#4b5563', fontWeight: '600' }}>Best Time</p>
                      <p style={{ color: '#1f2937' }}>{selectedMonastery.details.bestTime}</p>
                    </div>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>Find Nearby</h3>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                      gap: '12px'
                    }}>
                      <button
                        onClick={() => showNearbyPlaces('hospitals')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '12px',
                          backgroundColor: '#fef2f2',
                          border: '2px solid #fecaca',
                          color: '#b91c1c',
                          padding: '12px 16px',
                          borderRadius: '8px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'background-color 0.3s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                      >
                        <Hospital style={{ width: '20px', height: '20px' }} />
                        Hospitals
                      </button>
                      <button
                        onClick={() => showNearbyPlaces('hotels')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '12px',
                          backgroundColor: '#eff6ff',
                          border: '2px solid #bfdbfe',
                          color: '#1e40af',
                          padding: '12px 16px',
                          borderRadius: '8px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'background-color 0.3s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dbeafe'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
                      >
                        <Home style={{ width: '20px', height: '20px' }} />
                        Hotels
                      </button>
                      <button
                        onClick={() => showNearbyPlaces('restaurants')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '12px',
                          backgroundColor: '#f0fdf4',
                          border: '2px solid #bbf7d0',
                          color: '#15803d',
                          padding: '12px 16px',
                          borderRadius: '8px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'background-color 0.3s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dcfce7'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f0fdf4'}
                      >
                        <UtensilsCrossed style={{ width: '20px', height: '20px' }} />
                        Restaurants
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '24px' }}>
                  <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', textTransform: 'capitalize' }}>
                      Nearby {mapType}
                    </h3>
                    <button
                      onClick={() => setShowMap(false)}
                      style={{
                        color: '#d97706',
                        fontWeight: '600',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'color 0.3s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#b45309'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#d97706'}
                    >
                      ← Back to Details
                    </button>
                  </div>

                  {/* Map Display */}
                  <div style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    marginBottom: '24px',
                    border: '2px solid #e5e7eb'
                  }}>
                    <div style={{ position: 'relative', height: '400px' }}>
                      <iframe
                        width="100%"
                        height="400"
                        frameBorder="0"
                        scrolling="no"
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedMonastery.coordinates.lng - 0.1},${selectedMonastery.coordinates.lat - 0.1},${selectedMonastery.coordinates.lng + 0.1},${selectedMonastery.coordinates.lat + 0.1}&layer=mapnik&marker=${selectedMonastery.coordinates.lat},${selectedMonastery.coordinates.lng}`}
                        style={{ borderRadius: '12px 12px 0 0' }}
                        title={`Map of ${selectedMonastery.name}`}
                      ></iframe>
                    </div>
                    <div style={{ padding: '12px', backgroundColor: '#f9fafb', textAlign: 'center', borderTop: '1px solid #e5e7eb' }}>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                        <span style={{ fontWeight: '600', color: '#1f2937' }}>Monastery:</span> {selectedMonastery.coordinates.lat.toFixed(4)}°N, {selectedMonastery.coordinates.lng.toFixed(4)}°E
                      </p>
                    </div>
                  </div>

                  {/* Places List */}
                  <div style={{
                    backgroundColor: '#f9fafb',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '2px solid #e5e7eb'
                  }}>
                    <h4 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {mapType === 'hospitals' && <Hospital style={{ width: '24px', height: '24px', color: '#ef4444' }} />}
                      {mapType === 'hotels' && <Home style={{ width: '24px', height: '24px', color: '#3b82f6' }} />}
                      {mapType === 'restaurants' && <UtensilsCrossed style={{ width: '24px', height: '24px', color: '#22c55e' }} />}
                      Available {mapType.charAt(0).toUpperCase() + mapType.slice(1)}
                    </h4>

                    <div style={{ display: 'grid', gap: '12px' }}>
                      {selectedMonastery.nearby[mapType].map((place, index) => (
                        <div
                          key={index}
                          style={{
                            backgroundColor: 'white',
                            borderRadius: '8px',
                            padding: '16px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                            border: '1px solid #e5e7eb',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            transition: 'all 0.3s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <h5 style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>
                              {place.name}
                            </h5>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.875rem', color: '#6b7280' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <MapPin style={{ width: '14px', height: '14px', color: '#ef4444' }} />
                                {place.distance}
                              </span>
                              <span style={{ color: '#9ca3af' }}>•</span>
                              <span>
                                {place.coordinates.lat.toFixed(4)}°N, {place.coordinates.lng.toFixed(4)}°E
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => openInGoogleMaps(place.name, place.coordinates)}
                            style={{
                              backgroundColor: '#3b82f6',
                              color: 'white',
                              padding: '8px 16px',
                              borderRadius: '6px',
                              border: 'none',
                              fontSize: '0.875rem',
                              fontWeight: '600',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              transition: 'background-color 0.3s',
                              whiteSpace: 'nowrap'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                          >
                            <ExternalLink style={{ width: '14px', height: '14px' }} />
                            Directions
                          </button>
                        </div>
                      ))}
                    </div>

                    <div style={{
                      marginTop: '20px',
                      padding: '16px',
                      backgroundColor: '#fffbeb',
                      borderRadius: '8px',
                      border: '1px solid #fef3c7'
                    }}>
                      <p style={{ fontSize: '0.875rem', color: '#92400e', marginBottom: '8px' }}>
                        <span style={{ fontWeight: '600' }}>💡 Tip:</span> Click "Directions" to open the location in Google Maps for detailed navigation and route planning.
                      </p>
                      <p style={{ fontSize: '0.75rem', color: '#b45309', margin: 0 }}>
                        Distance is approximate and measured from {selectedMonastery.name}.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Navigation;
