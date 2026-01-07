import React from 'react';
import Navbar from '../components/Navbar';
import FloatingChatbot from '../components/FloatingChatbot';
import { ExternalLink } from 'lucide-react';

// Monasteries with virtual tour links
const virtualTourMonasteries = [
  {
    name: "Khajuraho Temples",
    location: "Chhatarpur District",
    description: "Explore the intricate sculptures and nagara-style architecture of the Kandariya Mahadev Temple.",
    image: "/img/khajuraho.png",
    tourUrl: "https://www.google.com/maps/@24.8519783,79.9200404,2a,75y,260h,90t/data=!3m7!1e1!3m5!1sCAoSLEFGMVFpcE9XbzE0LUcxbkF1QkF1QkF1QkF1QkF1QkF1QkF1QkF1QkF1QkF1!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fpanoid%3DCAoSLEFGMVFpcE9XbzE0LUcxbkF1QkF1QkF1QkF1QkF1QkF1QkF1QkF1QkF1QkF1%26cb_client%3Dmaps_sv.tactile.gps%26w%3D203%26h%3D100%26yaw%3D260%26pitch%3D0%26thumbfov%3D100!7i13312!8i6656",
    sect: "Hindu/Jain",
    founded: "950-1050 CE"
  },
  {
    name: "Sanchi Stupa",
    location: "Raisen District",
    description: "Walk around the Great Stupa and ancient gateways commissioned by Emperor Ashoka.",
    image: "/img/sanchi_stupa.png",
    tourUrl: "/ar-tour",
    sect: "Buddhist",
    founded: "3rd Century BCE"
  },
  {
    name: "Gwalior Fort",
    location: "Gwalior",
    description: "Experience the grandeur of the Man Singh Palace and ancient temples within the fort walls.",
    image: "/img/gwalior_fort.png",
    tourUrl: "https://www.google.com/maps/@26.2300407,78.1685899,2a,75y,100h,90t/data=!3m7!1e1!3m5!1sCAoSLEFGMVFpcE9lX1l4X1l4X1l4X1l4X1l4X1l4X1l4X1l4X1l4X1l4X1l4X1l4!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fpanoid%3DCAoSLEFGMVFpcE9lX1l4X1l4X1l4X1l4X1l4X1l4X1l4X1l4X1l4X1l4X1l4X1l4%26cb_client%3Dmaps_sv.tactile.gps%26w%3D203%26h%3D100%26yaw%3D100%26pitch%3D0%26thumbfov%3D100!7i13312!8i6656",
    sect: "Historical",
    founded: "8th Century CE"
  },
  {
    name: "Bhimbetka Rock Shelters",
    location: "Raisen District",
    description: "Step back in time to view prehistoric cave paintings in their natural setting.",
    image: "/img/bhimbetka.png",
    tourUrl: "https://www.google.com/maps/@22.9372,77.6127,2a,75y,180h,90t/data=!3m7!1e1!3m5!1sCAoSLEFGMVFpcE9lX1l4X1l4X1l4X1l4X1l4X1l4X1l4X1l4X1l4X1l4X1l4X1l4!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fpanoid%3DCAoSLEFGMVFpcE9lX1l4X1l4X1l4X1l4X1l4X1l4X1l4X1l4X1l4X1l4X1l4X1l4%26cb_client%3Dmaps_sv.tactile.gps%26w%3D203%26h%3D100%26yaw%3D180%26pitch%3D0%26thumbfov%3D100!7i13312!8i6656",
    sect: "Prehistoric",
    founded: "Paleolithic"
  },
  {
    name: "Orchha Fort",
    location: "Niwari District",
    description: "Wander through the Jahangir Mahal and Raja Mahal in this medieval architectural marvel.",
    image: "/img/orchha_fort.png",
    tourUrl: "https://www.google.com/maps/@25.3508,78.6415,2a,75y,300h,90t/data=!3m7!1e1!3m5!1sCAoSLEFGMVFpcE9lX1l4X1l4X1l4X1l4X1l4X1l4X1l4X1l4X1l4X1l4X1l4X1l4!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fpanoid%3DCAoSLEFGMVFpcE9lX1l4X1l4X1l4X1l4X1l4X1l4X1l4X1l4X1l4X1l4X1l4X1l4%26cb_client%3Dmaps_sv.tactile.gps%26w%3D203%26h%3D100%26yaw%3D300%26pitch%3D0%26thumbfov%3D100!7i13312!8i6656",
    sect: "Historical",
    founded: "16th Century"
  },
  {
    name: "Jahaz Mahal",
    location: "Mandu",
    description: "Explore the Ship Palace 'floating' between two lakes in the historic city of Mandu.",
    image: "/img/jahaz_mahal.png",
    tourUrl: "https://www.google.com/maps/@22.3670,75.4045,2a,75y,40h,90t/data=!3m7!1e1!3m5!1sCAoSLEFGMVFpcE9lX1l4X1l4X1l4X1l4X1l4X1l4X1l4X1l4X1l4X1l4X1l4X1l4!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fpanoid%3DCAoSLEFGMVFpcE9lX1l4X1l4X1l4X1l4X1l4X1l4X1l4X1l4X1l4X1l4X1l4X1l4%26cb_client%3Dmaps_sv.tactile.gps%26w%3D203%26h%3D100%26yaw%3D40%26pitch%3D0%26thumbfov%3D100!7i13312!8i6656",
    sect: "Afghan Architecture",
    founded: "15th Century"
  }
];

import { useNavigate } from 'react-router-dom';

const VirtualTours = () => {
  const navigate = useNavigate();

  const handleTourClick = (tourUrl) => {
    if (tourUrl.startsWith('/')) {
      navigate(tourUrl);
    } else {
      window.open(tourUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <Navbar />

      <div style={{ paddingTop: '80px', paddingBottom: '60px', paddingLeft: '20px', paddingRight: '20px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h1 style={{ fontSize: '42px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>
              MP Heritage 360° Tours
            </h1>
            <p style={{ fontSize: '18px', color: '#6b7280', maxWidth: '700px', margin: '0 auto' }}>
              Experience immersive 360° virtual tours of Madhya Pradesh's magnificent heritage sites from anywhere in the world
            </p>
          </div>

          {/* Monastery Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '30px',
            marginBottom: '40px'
          }}>
            {virtualTourMonasteries.map((monastery, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  cursor: 'pointer'
                }}
                onClick={() => handleTourClick(monastery.tourUrl)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                }}
              >
                {/* Image */}
                <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                  <img
                    src={monastery.image}
                    alt={monastery.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '15px',
                    right: '15px',
                    backgroundColor: 'rgba(139, 92, 246, 0.9)',
                    color: 'white',
                    padding: '8px 15px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}>
                    <ExternalLink size={14} />
                    360° Tour
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '25px' }}>
                  <h3 style={{
                    fontSize: '22px',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    marginBottom: '10px'
                  }}>
                    {monastery.name}
                  </h3>

                  <div style={{
                    display: 'flex',
                    gap: '15px',
                    marginBottom: '15px',
                    fontSize: '13px',
                    color: '#6b7280'
                  }}>
                    <span style={{
                      backgroundColor: '#dbeafe',
                      color: '#1e40af',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontWeight: '500'
                    }}>
                      {monastery.sect}
                    </span>
                    <span style={{
                      backgroundColor: '#dcfce7',
                      color: '#166534',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontWeight: '500'
                    }}>
                      {monastery.founded}
                    </span>
                  </div>

                  <p style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    marginBottom: '15px',
                    lineHeight: '1.6'
                  }}>
                    📍 {monastery.location}
                  </p>

                  <p style={{
                    fontSize: '14px',
                    color: '#4b5563',
                    lineHeight: '1.6',
                    marginBottom: '20px'
                  }}>
                    {monastery.description}
                  </p>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#8b5cf6',
                    fontSize: '15px',
                    fontWeight: '600'
                  }}>
                    <span>Start Virtual Tour</span>
                    <ExternalLink size={16} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Info Section */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '30px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>
              How to Experience Virtual Tours
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
              marginTop: '30px'
            }}>
              <div style={{ padding: '20px' }}>
                <div style={{ fontSize: '36px', marginBottom: '10px' }}>🖱️</div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>Click & Drag</h3>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>Use your mouse to look around in 360 degrees</p>
              </div>
              <div style={{ padding: '20px' }}>
                <div style={{ fontSize: '36px', marginBottom: '10px' }}>🔍</div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>Zoom In/Out</h3>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>Use scroll wheel to zoom and explore details</p>
              </div>
              <div style={{ padding: '20px' }}>
                <div style={{ fontSize: '36px', marginBottom: '10px' }}>📱</div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>Mobile Friendly</h3>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>Works on all devices including smartphones</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FloatingChatbot />
    </div>
  );
};

export default VirtualTours;
