import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import FloatingChatbot from '../components/FloatingChatbot';
import { storyAPI } from '../services/api';

const Home = () => {
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonastery, setSelectedMonastery] = useState(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Madhya Pradesh Heritage Sites with coordinates
  const monasteries = [
    {
      id: 1,
      name: 'Khajuraho Temples',
      lat: 24.8318,
      lng: 79.9199,
      description: 'UNESCO World Heritage Site famous for stunning temple architecture.',
      image: '/img/khajuraho.png'
    },
    {
      id: 2,
      name: 'Mahakaleshwar Temple',
      lat: 23.1765,
      lng: 75.7683,
      description: 'One of the 12 Jyotirlingas in Ujjain, highly revered Shiva temple.',
      image: '/img/mahakaleshwar.png'
    },
    {
      id: 3,
      name: 'Omkareshwar Temple',
      lat: 22.2403,
      lng: 76.1351,
      description: 'Sacred Jyotirlinga temple on an island shaped like Om symbol.',
      image: '/img/omkareshwar.png'
    },
    {
      id: 4,
      name: 'Sanchi Stupa',
      lat: 23.4794,
      lng: 77.7391,
      description: 'Ancient Buddhist complex commissioned by Emperor Ashoka.',
      image: '/img/sanchi_stupa.png'
    },
    {
      id: 5,
      name: 'Gwalior Fort',
      lat: 26.2295,
      lng: 78.1779,
      description: 'One of India\'s most impregnable fortresses with magnificent palaces.',
      image: '/img/gwalior_fort.png'
    },
    {
      id: 6,
      name: 'Orchha Fort Complex',
      lat: 25.3519,
      lng: 78.6420,
      description: 'Medieval fort complex showcasing Bundela Rajput architecture.',
      image: '/img/orchha_fort.png'
    },
    {
      id: 7,
      name: 'Jahaz Mahal',
      lat: 22.3623,
      lng: 75.3965,
      description: 'Ship Palace in Mandu appearing to float between two lakes.',
      image: '/img/jahaz_mahal.png'
    },
    {
      id: 8,
      name: 'Bhimbetka Rock Shelters',
      lat: 22.9422,
      lng: 77.6111,
      description: 'UNESCO site with ancient rock paintings over 30,000 years old.',
      image: '/img/bhimbetka.png'
    },
    {
      id: 9,
      name: 'Kandariya Mahadev Temple',
      lat: 24.8520,
      lng: 79.9199,
      description: 'Largest temple in Khajuraho, epitome of Chandela architecture.',
      image: '/img/khajuraho.png'
    },
    {
      id: 10,
      name: 'Udayagiri Caves',
      lat: 23.5306,
      lng: 77.8053,
      description: 'Rock-cut caves with important Hindu iconography from Gupta period.',
      image: '/img/bhimbetka.png'
    },
    {
      id: 11,
      name: 'Bhojpur Temple',
      lat: 23.4917,
      lng: 77.6244,
      description: 'Incomplete temple with one of India\'s largest Shiva lingams.',
      image: '/img/bhojpur_temple.png'
    },
    {
      id: 12,
      name: 'Chaturbhuj Temple',
      lat: 25.3523,
      lng: 78.6397,
      description: 'Unique temple blending palace, fort, and temple architecture.',
      image: '/img/orchha_fort.png'
    },
    {
      id: 13,
      name: 'Dhar Fort',
      lat: 22.5976,
      lng: 75.2976,
      description: 'Ancient fort with rich Paramara dynasty heritage.',
      image: '/img/jahaz_mahal.png'
    },
    {
      id: 14,
      name: 'Mandu Fort Complex',
      lat: 22.3623,
      lng: 75.3965,
      description: 'Afghan architecture showcase with palaces and monuments.',
      image: '/img/jahaz_mahal.png'
    },
    {
      id: 15,
      name: 'Jain Temples of Sonagiri',
      lat: 25.7102,
      lng: 78.3756,
      description: 'Important Jain pilgrimage site with white temples on hilltop.',
      image: '/img/khajuraho.png'
    }
  ];

  useEffect(() => {
    fetchApprovedContent();
    // Set default selected monastery
    setSelectedMonastery(monasteries[0]);
  }, []);

  useEffect(() => {
    if (selectedMonastery) {
      initializeMap();
    }
  }, [selectedMonastery]);

  const initializeMap = () => {
    if (window.google && window.google.maps && mapRef.current) {
      // Center of Sikkim
      const mpCenter = { lat: 23.2599, lng: 77.4126 }; // Center of Madhya Pradesh (Bhopal)

      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 7,
        center: mpCenter,
        mapTypeId: 'terrain',
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'on' }]
          }
        ]
      });

      mapInstanceRef.current = map;

      // Add markers for each monastery
      monasteries.forEach((monastery) => {
        const marker = new window.google.maps.Marker({
          position: { lat: monastery.lat, lng: monastery.lng },
          map: map,
          title: monastery.name,
          animation: window.google.maps.Animation.DROP,
          icon: {
            url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
          }
        });

        // Info window for each marker
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="max-width: 250px;">
              <h4 style="margin: 0 0 10px 0; color: #667eea;">${monastery.name}</h4>
              <img src="${monastery.image}" alt="${monastery.name}" 
                   style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px; margin-bottom: 10px;"
                   onerror="this.style.display='none'">
              <p style="margin: 0; font-size: 14px; color: #555;">${monastery.description}</p>
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
          // Update the right side container with clicked monastery details
          setSelectedMonastery(monastery);
        });
      });
    }
  };

  const fetchApprovedContent = async () => {
    try {
      const response = await storyAPI.getAllStories({ status: 'approved' });
      const approvedStories = response.data.stories;

      // Separate by type
      setPhotos(approvedStories.filter(story => story.type === 'photo'));
      setVideos(approvedStories.filter(story => story.type === 'video'));
      setStories(approvedStories.filter(story => story.type === 'story'));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching approved content:', error);
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="hero">
        <video autoPlay muted loop className="video-background">
          <source src="/video/InShot_20260106_230746648.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="hero-content">
          <h1>Discover Madhya Pradesh Heritage</h1>
          <p>
            Explore the ancient temples and monuments of Madhya Pradesh through immersive virtual tours
            and a rich digital archive. Experience the cultural heritage and spiritual
            essence of these sacred sites from anywhere in the world.
          </p>
          <a
            href="/virtual-tours"
            className="btn"
          >
            Start Exploring
          </a>
        </div>
      </section>

      {/* MP Heritage Map Section */}
      <section id="mp-map">
        <h2>Interactive Map of MP Heritage Sites</h2>
        <div className="map-container">
          <div
            ref={mapRef}
            id="map"
            style={{
              height: '400px',
              background: '#e0e0e0',
              borderRadius: '8px',
              width: '100%'
            }}
          />
          <div id="monastery-details">
            {selectedMonastery ? (
              <>
                <h4>{selectedMonastery.name}</h4>
                <div className="img">
                  <img
                    src={selectedMonastery.image}
                    alt={selectedMonastery.name}
                    id="monastery-img"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=' + selectedMonastery.name;
                    }}
                  />
                </div>
                <div className="monastery-desc">
                  <p>{selectedMonastery.description}</p>
                </div>
              </>
            ) : (
              <p style={{ textAlign: 'center', color: '#999' }}>Click on a marker to view monastery details</p>
            )}
          </div>
        </div>
      </section>

      {/* Community Photos Section */}
      <section style={{
        padding: '60px 20px',
        background: '#f8f9fa',
        minHeight: '400px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2.5rem',
            marginBottom: '15px',
            color: '#2c3e50',
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            Community Photos
          </h2>
          <p style={{
            fontSize: '1.2rem',
            color: '#666',
            marginBottom: '40px',
            textAlign: 'center'
          }}>
            See photos shared by our community members
          </p>

          {loading ? (
            <p style={{ textAlign: 'center', fontSize: '18px', color: '#666' }}>Loading photos...</p>
          ) : photos.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              background: 'white',
              borderRadius: '15px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <p style={{ fontSize: '48px', margin: '0 0 20px' }}>📸</p>
              <h3 style={{ color: '#666', marginBottom: '10px' }}>No Photos Yet</h3>
              <p style={{ color: '#999' }}>Be the first to share your monastery experience!</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '25px'
            }}>
              {photos.map((photo) => (
                <div
                  key={photo._id}
                  style={{
                    background: 'white',
                    borderRadius: '15px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                  }}
                >
                  {/* Photo Image */}
                  <div style={{ height: '250px', overflow: 'hidden', background: '#e0e0e0' }}>
                    <img
                      src={photo.mediaUrl}
                      alt={photo.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>

                  {/* Photo Details */}
                  <div style={{ padding: '20px' }}>
                    <h3 style={{
                      fontSize: '1.3rem',
                      marginBottom: '10px',
                      color: '#2c3e50',
                      fontWeight: 'bold'
                    }}>
                      {photo.title}
                    </h3>

                    <p style={{
                      color: '#666',
                      fontSize: '14px',
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span>🏛️</span>
                      <strong>{photo.monastery}</strong>
                    </p>

                    <p style={{
                      color: '#666',
                      fontSize: '14px',
                      marginBottom: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span>👤</span>
                      {photo.authorName}
                    </p>

                    <p style={{
                      color: '#555',
                      fontSize: '14px',
                      lineHeight: '1.6',
                      maxHeight: '60px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {photo.content.substring(0, 100)}...
                    </p>

                    <div style={{
                      marginTop: '15px',
                      paddingTop: '15px',
                      borderTop: '1px solid #eee',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{ color: '#999', fontSize: '13px' }}>
                        👁️ {photo.views} views
                      </span>
                      <span style={{
                        color: '#28a745',
                        fontSize: '12px',
                        background: '#d4edda',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontWeight: 'bold'
                      }}>
                        ✓ Approved
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Community Videos Section */}
      <section style={{
        padding: '60px 20px',
        background: '#ffffff',
        minHeight: '400px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2.5rem',
            marginBottom: '15px',
            color: '#2c3e50',
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            Community Videos
          </h2>
          <p style={{
            fontSize: '1.2rem',
            color: '#666',
            marginBottom: '40px',
            textAlign: 'center'
          }}>
            Watch videos shared by our community members
          </p>

          {loading ? (
            <p style={{ textAlign: 'center', fontSize: '18px', color: '#666' }}>Loading videos...</p>
          ) : videos.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              background: '#f8f9fa',
              borderRadius: '15px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <p style={{ fontSize: '48px', margin: '0 0 20px' }}>🎥</p>
              <h3 style={{ color: '#666', marginBottom: '10px' }}>No Videos Yet</h3>
              <p style={{ color: '#999' }}>Be the first to share your monastery video!</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '25px'
            }}>
              {videos.map((video) => (
                <div
                  key={video._id}
                  style={{
                    background: 'white',
                    borderRadius: '15px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    transition: 'transform 0.3s, box-shadow 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                  }}
                >
                  {/* Video Player */}
                  <div style={{ background: '#000' }}>
                    <video
                      src={video.mediaUrl}
                      controls
                      style={{
                        width: '100%',
                        height: '250px',
                        objectFit: 'contain'
                      }}
                    />
                  </div>

                  {/* Video Details */}
                  <div style={{ padding: '20px' }}>
                    <h3 style={{
                      fontSize: '1.3rem',
                      marginBottom: '10px',
                      color: '#2c3e50',
                      fontWeight: 'bold'
                    }}>
                      {video.title}
                    </h3>

                    <p style={{
                      color: '#666',
                      fontSize: '14px',
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span>🏛️</span>
                      <strong>{video.monastery}</strong>
                    </p>

                    <p style={{
                      color: '#666',
                      fontSize: '14px',
                      marginBottom: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span>👤</span>
                      {video.authorName}
                    </p>

                    <p style={{
                      color: '#555',
                      fontSize: '14px',
                      lineHeight: '1.6',
                      maxHeight: '60px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {video.content.substring(0, 100)}...
                    </p>

                    <div style={{
                      marginTop: '15px',
                      paddingTop: '15px',
                      borderTop: '1px solid #eee',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{ color: '#999', fontSize: '13px' }}>
                        👁️ {video.views} views
                      </span>
                      <span style={{
                        color: '#28a745',
                        fontSize: '12px',
                        background: '#d4edda',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontWeight: 'bold'
                      }}>
                        ✓ Approved
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Community Stories/Experiences Section */}
      {stories.length > 0 && (
        <section style={{
          padding: '60px 20px',
          background: '#f8f9fa',
          minHeight: '400px',
          textAlign: 'center'
        }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <h2 style={{
              fontSize: '2.5rem',
              marginBottom: '15px',
              color: '#2c3e50',
              fontWeight: 'bold',
              textAlign: 'center'
            }}>
              Community Experiences
            </h2>
            <p style={{
              fontSize: '1.2rem',
              color: '#666',
              marginBottom: '40px',
              textAlign: 'center'
            }}>
              Read stories and experiences shared by our community members
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '25px'
            }}>
              {stories.map((story) => (
                <div
                  key={story._id}
                  style={{
                    background: 'white',
                    borderRadius: '15px',
                    padding: '25px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                  }}
                >
                  <h3 style={{
                    fontSize: '1.4rem',
                    marginBottom: '15px',
                    color: '#2c3e50',
                    fontWeight: 'bold'
                  }}>
                    {story.title}
                  </h3>

                  <p style={{
                    color: '#666',
                    fontSize: '14px',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span>🏛️</span>
                    <strong>{story.monastery}</strong>
                  </p>

                  <p style={{
                    color: '#666',
                    fontSize: '14px',
                    marginBottom: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span>👤</span>
                    {story.authorName}
                  </p>

                  <p style={{
                    color: '#555',
                    fontSize: '15px',
                    lineHeight: '1.7',
                    marginBottom: '20px',
                    maxHeight: '120px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {story.content.substring(0, 200)}...
                  </p>

                  <div style={{
                    paddingTop: '15px',
                    borderTop: '1px solid #eee',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ color: '#999', fontSize: '13px' }}>
                      👁️ {story.views} views
                    </span>
                    <span style={{
                      color: '#28a745',
                      fontSize: '12px',
                      background: '#d4edda',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontWeight: 'bold'
                    }}>
                      ✓ Approved
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <FloatingChatbot />
    </>
  );
};

export default Home;
