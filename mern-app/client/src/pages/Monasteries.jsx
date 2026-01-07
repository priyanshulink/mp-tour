import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import FloatingChatbot from '../components/FloatingChatbot';
import { X } from 'lucide-react';

// Detailed heritage site data for Madhya Pradesh
const monumentData = {
  khajuraho: {
    name: "Khajuraho Temples",
    overview: "The Khajuraho Group of Monuments is a UNESCO World Heritage Site renowned for its stunning temple architecture and intricate sculptures. Built by the Chandela dynasty between 950-1050 CE, these temples represent the zenith of northern Indian temple architecture and are world-famous for their artistic excellence and erotic sculptures.",
    history: "Constructed during the Chandela dynasty's golden age, Khajuraho originally had 85 temples. Only 25 temples survive today. The temples were built over a period of 100 years and showcase the religious fervor and architectural brilliance of medieval India. After the decline of the Chandela dynasty, the temples were forgotten until their rediscovery by British engineer T.S. Burt in 1838.",
    architecture: "Khajuraho temples feature the nagara-style architectural style with intricate carvings covering every surface. The temples are built on high platforms with elaborate entrances. The sculptural art depicts gods, goddesses, celestial beings, warriors, musicians, and scenes from daily life. The most distinctive feature is the representation of human emotions and sensuality through sculpture.",
    festivals: "The annual Khajuraho Dance Festival (February-March) is a week-long celebration of classical Indian dance forms. Artists from across India perform against the backdrop of the illuminated temples, creating a magical cultural experience.",
    visitingInfo: "Best visited between October and March when the weather is pleasant. The Western Group of temples is the main attraction and can be explored in a day. Light and sound shows are held in the evenings. The site is well-connected by air, rail, and road."
  },
  mahakaleshwar: {
    name: "Mahakaleshwar Temple",
    overview: "Mahakaleshwar Temple in Ujjain is one of the twelve Jyotirlingas, the most sacred abodes of Lord Shiva. The temple is located on the banks of the Shipra River and is unique as the lingam faces south (Dakshimukhiswara Mahakaleshwar), a rare feature among the Jyotirlingas.",
    history: "The temple has ancient origins mentioned in various Puranas and legendary texts. The current structure was built in the 18th century by the Maratha general Ranoji Scindia after earlier structures were destroyed. The temple has been a major pilgrimage site for centuries and plays a central role in the famous Kumbh Mela celebrations held every 12 years in Ujjain.",
    architecture: "The temple features Maratha, Bhumija, and Chalukya architectural styles. The five-story structure has a spacious courtyard with an impressive dome. The sanctum sanctorum houses the swayambhu (self-manifested) lingam. The temple complex includes several smaller shrines and a sacred pool.",
    festivals: "The Bhasma Aarti (ash ritual) performed daily at 4 AM is the temple's most unique ritual. Mahashivratri draws millions of devotees. The Kumbh Mela, held every 12 years, transforms Ujjain into one of the world's largest religious gatherings.",
    visitingInfo: "The temple is open from early morning to late evening with specific darshan timings. Online booking is recommended for Bhasma Aarti. Dress modestly and follow temple protocols. The temple town offers various accommodations for pilgrims."
  },
  omkareshwar: {
    name: "Omkareshwar Temple",
    overview: "Omkareshwar is a sacred Hindu temple dedicated to Lord Shiva, situated on an island in the Narmada River. The island is shaped like the Hindu 'Om' symbol, giving the temple its name. It is one of the 12 Jyotirlingas and attracts millions of pilgrims annually.",
    history: "The temple has ancient origins with mentions in Puranic literature. The present structure dates back to medieval times. According to legend, the gods prayed to Lord Shiva here, leading to the manifestation of the Jyotirlinga. The temple complex has been renovated multiple times over centuries.",
    architecture: "The temple showcases a blend of Hindu and Jain architectural styles with intricate stone carvings. The main temple has a unique 'Om' shaped sanctum. The complex includes multiple shrines, ghats along the Narmada, and a picturesque bridge connecting to the mainland.",
    festivals: "Mahashivratri is celebrated with great fervor. The Kartik Purnima fair attracts thousands of devotees. Daily evening aarti on the Narmada ghats creates a spiritual atmosphere.",
    visitingInfo: "Best visited between October and March. A parikrama (circumambulation) of the island is considered auspicious and takes 2-3 hours. Boat rides on the Narmada offer scenic views. The site is accessible by road from Indore (77 km)."
  },
  sanchi: {
    name: "Sanchi Stupa",
    overview: "The Great Stupa at Sanchi is the oldest stone structure in India and a UNESCO World Heritage Site. Commissioned by Emperor Ashoka in the 3rd century BCE, it represents the architectural and spiritual achievements of ancient India and is one of Buddhism's most important monuments.",
    history: "Built by Emperor Ashoka after his conversion to Buddhism following the Kalinga War, Sanchi was chosen for its proximity to Vidisha, an important trade route city. The site was expanded over subsequent centuries. After Buddhism's decline in India, the site was forgotten until its rediscovery in 1818. Restoration work began under British archaeologists and Indian conservation efforts.",
    architecture: "The Great Stupa (Stupa 1) is a hemispherical dome (anda) with a central chamber housing relics. Four ornate gateways (toranas) feature intricate carvings depicting Buddha's life, Jataka tales, and historical events. The site includes multiple stupas, monasteries, temples, and pillars showcasing Mauryan, Shunga, and Gupta period architecture.",
    festivals: "Buddha Purnima (April-May) is celebrated with special prayers and cultural programs. The anniversary of the Buddha's enlightenment draws Buddhist pilgrims from around the world. The site hosts occasional exhibitions on Buddhism and ancient Indian art.",
    visitingInfo: "Open daily except Fridays. A museum on-site displays artifacts from excavations. The best time to visit is October to March. The site is 46 km from Bhopal and easily accessible by road and rail. Allow 2-3 hours for a complete visit."
  },
  gwalior: {
    name: "Gwalior Fort",
    overview: "Gwalior Fort, described as 'the pearl amongst fortresses in India' by Mughal Emperor Babur, is a historic hill fortress covering an area of 3 square kilometers. The fort has been controlled by various dynasties and witnessed significant historical events over its 1,000-year history.",
    history: "The fort's origins date back to the 8th century CE, though legends trace it to even earlier times. It was ruled by the Tomars, Pratiharas, Mughals, Marathas, and British. Notable events include the imprisonment of Mughal emperor Aurangzeb's brother, the 1857 uprising, and Rani Lakshmibai's resistance during the Indian Rebellion.",
    architecture: "The fort comprises two main palaces: the Man Mandir Palace with its distinctive blue ceramic tiles and latticed windows, and Gujari Mahal, now an archaeological museum. The fort also houses the Teli ka Mandir temple (9th century) and Sas-Bahu temples showcasing intricate carvings. Massive defensive walls and six gates protect the complex.",
    festivals: "The fort hosts the annual Tansen Music Festival (November-December) celebrating the legendary musician Tansen, one of Emperor Akbar's nine jewels. Sound and light shows narrate the fort's history in the evenings.",
    visitingInfo: "Open daily from sunrise to sunset. Entry via Gwalior Gate or Urvai Gate. Allow half a day to explore the entire complex. The fort offers panoramic views of Gwalior city. Guides are available for hire. The site is accessible year-round, though summers can be hot."
  },
  orchha: {
    name: "Orchha Fort Complex",
    overview: "Orchha Fort Complex is a stunning medieval fort and palace complex showcasing Bundela Rajput architecture. Founded in the 16th century by Bundela chief Rudra Pratap Singh, Orchha served as the capital of the Bundela kingdom and features magnificent palaces, temples, and cenotaphs.",
    history: "Orchha was established in 1501 and flourished under Bundela rulers, particularly Bir Singh Deo who built most of the existing structures in the early 17th century. The town maintained its importance until the capital shifted to Tikamgarh in the 18th century. The fort complex and town preserve the grandeur of Bundela architecture and culture.",
    architecture: "The fort complex includes three main palaces: Raja Mahal with exquisite murals depicting religious themes, Jahangir Mahal built to commemorate the Mughal emperor's visit featuring balanced Islamic and Rajput design, and Rai Parveen Mahal dedicated to a court poet. The complex also includes the unique Chaturbhuj Temple blending temple and fort architecture, and beautiful cenotaphs (chhatris) along the Betwa River.",
    festivals: "The annual Orchha Festival (November) showcases cultural performances, light and sound shows, and heritage walks. Ram Navami witnesses grand celebrations at the Ram Raja Temple, where Lord Ram is worshipped as a king. Evening aarti on the Betwa riverbank creates a mystical atmosphere.",
    visitingInfo: "Best visited between October and March. Allow a full day to explore the fort complex, temples, and cenotaphs. Heritage walks and cycling tours are popular. Sound and light shows narrate Orchha's history. The town offers various accommodation options including heritage hotels. Orchha is 18 km from Jhansi railway station."
  }
};

// Monument cards data
const monuments = [
  {
    key: "khajuraho",
    name: "Khajuraho Temples",
    location: "Khajuraho, Chhatarpur District",
    sect: "Hindu",
    founded: "950-1050 CE",
    description: "UNESCO World Heritage Site with stunning temple architecture.",
    image: "/img/khajuraho.png"
  },
  {
    key: "mahakaleshwar",
    name: "Mahakaleshwar Temple",
    location: "Ujjain, Madhya Pradesh",
    sect: "Hindu (Shaivism)",
    founded: "Ancient (18th century structure)",
    description: "One of the 12 Jyotirlingas, highly revered Shiva temple.",
    image: "/img/mahakaleshwar.png"
  },
  {
    key: "omkareshwar",
    name: "Omkareshwar Temple",
    location: "Omkareshwar, Khandwa",
    sect: "Hindu (Shaivism)",
    founded: "Ancient",
    description: "Sacred Jyotirlinga on an island shaped like Om.",
    image: "/img/omkareshwar.png"
  },
  {
    key: "sanchi",
    name: "Sanchi Stupa",
    location: "Sanchi, Raisen District",
    sect: "Buddhist",
    founded: "3rd century BCE",
    description: "Ancient Buddhist complex by Emperor Ashoka.",
    image: "/img/sanchi_stupa.png"
  },
  {
    key: "gwalior",
    name: "Gwalior Fort",
    location: "Gwalior, Madhya Pradesh",
    sect: "Historical Monument",
    founded: "8th century",
    description: "Impregnable fortress with magnificent palaces.",
    image: "/img/gwalior_fort.png"
  },
  {
    key: "orchha",
    name: "Orchha Fort Complex",
    location: "Orchha, Tikamgarh",
    sect: "Historical Monument",
    founded: "16th century",
    description: "Medieval fort showcasing Bundela architecture.",
    image: "/img/orchha_fort.png"
  },
  {
    key: "bhimbetka",
    name: "Bhimbetka Rock Shelters",
    location: "Raisen District",
    sect: "Ancient Heritage",
    founded: "Paleolithic Age",
    description: "UNESCO site with 30,000+ year old rock paintings.",
    image: "/img/bhimbetka.png"
  },
  {
    key: "mandu",
    name: "Jahaz Mahal",
    location: "Mandu, Dhar District",
    sect: "Historical Monument",
    founded: "15th century",
    description: "Ship Palace appearing to float between lakes.",
    image: "/img/jahaz_mahal.png"
  }
];

const Monasteries = () => {
  const [filter, setFilter] = useState('All');
  const [filteredMonuments, setFilteredMonuments] = useState(monuments);
  const [selectedMonument, setSelectedMonument] = useState(null);

  useEffect(() => {
    if (filter === 'All') {
      setFilteredMonuments(monuments);
    } else {
      setFilteredMonuments(monuments.filter(m => m.sect.toLowerCase().includes(filter.toLowerCase())));
    }
  }, [filter]);

  const handleMoreClick = (monument) => {
    setSelectedMonument(monument);
  };

  const closeModal = () => {
    setSelectedMonument(null);
  };

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <div style={{
        paddingTop: '80px',
        background: 'linear-gradient(135deg, #8B4513 0%, #D2691E 100%)',
        color: 'white',
        padding: '100px 20px 60px',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '15px', fontWeight: 'bold' }}>
          Heritage Sites of Madhya Pradesh
        </h1>
        <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>
          Explore the rich cultural heritage of Madhya Pradesh. Click a card to learn more.
        </p>
      </div>

      {/* Main Content */}
      <div style={{ minHeight: '100vh', background: '#f5f5f5', padding: '50px 20px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

          {/* Filter Buttons */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <button
              onClick={() => setFilter('All')}
              style={{
                margin: '5px',
                padding: '12px 30px',
                background: filter === 'All' ? '#8B4513' : 'white',
                color: filter === 'All' ? 'white' : '#333',
                border: '2px solid #8B4513',
                borderRadius: '25px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '15px',
                transition: 'all 0.3s'
              }}
            >
              All
            </button>
            <button
              onClick={() => setFilter('Hindu')}
              style={{
                margin: '5px',
                padding: '12px 30px',
                background: filter === 'Hindu' ? '#8B4513' : 'white',
                color: filter === 'Hindu' ? 'white' : '#333',
                border: '2px solid #8B4513',
                borderRadius: '25px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '15px',
                transition: 'all 0.3s'
              }}
            >
              Hindu
            </button>
            <button
              onClick={() => setFilter('Buddhist')}
              style={{
                margin: '5px',
                padding: '12px 30px',
                background: filter === 'Buddhist' ? '#8B4513' : 'white',
                color: filter === 'Buddhist' ? 'white' : '#333',
                border: '2px solid #8B4513',
                borderRadius: '25px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '15px',
                transition: 'all 0.3s'
              }}
            >
              Buddhist
            </button>
            <button
              onClick={() => setFilter('Historical')}
              style={{
                margin: '5px',
                padding: '12px 30px',
                background: filter === 'Historical' ? '#8B4513' : 'white',
                color: filter === 'Historical' ? 'white' : '#333',
                border: '2px solid #8B4513',
                borderRadius: '25px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '15px',
                transition: 'all 0.3s'
              }}
            >
              Historical
            </button>
          </div>

          {/* Monuments Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '30px'
          }}>
            {filteredMonuments.map((monument, index) => (
              <div
                key={index}
                style={{
                  background: 'white',
                  borderRadius: '12px',
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
                {/* Monument Image */}
                <div style={{ height: '220px', overflow: 'hidden' }}>
                  <img
                    src={monument.image}
                    alt={monument.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  />
                </div>

                {/* Card Content */}
                <div style={{ padding: '20px' }}>
                  <h3 style={{
                    marginBottom: '12px',
                    fontSize: '1.4rem',
                    fontWeight: 'bold',
                    color: '#1a1a1a'
                  }}>
                    {monument.name}
                  </h3>

                  <p style={{
                    color: '#666',
                    fontSize: '0.95rem',
                    lineHeight: '1.5',
                    marginBottom: '15px',
                    minHeight: '45px'
                  }}>
                    {monument.description}
                  </p>

                  {/* Action Button */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    marginTop: '15px'
                  }}>
                    <button
                      onClick={() => handleMoreClick(monument)}
                      style={{
                        background: '#8B4513',
                        color: 'white',
                        border: 'none',
                        padding: '10px 25px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '0.95rem',
                        transition: 'background 0.3s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#654321'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#8B4513'}
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal for detailed monument information */}
      {selectedMonument && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            padding: '20px',
            overflowY: 'auto'
          }}
          onClick={closeModal}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '15px',
              maxWidth: '900px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              position: 'relative',
              margin: '20px auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontWeight: 'bold',
                zIndex: 10,
                transition: 'background 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#c82333'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#dc3545'}
            >
              <X size={24} />
            </button>

            {/* Modal Image */}
            <img
              src={selectedMonument.image}
              alt={selectedMonument.name}
              style={{
                width: '100%',
                height: '280px',
                objectFit: 'cover',
                borderRadius: '15px 15px 0 0'
              }}
            />

            {/* Modal Content */}
            <div style={{ padding: '35px' }}>
              <h2 style={{
                marginBottom: '10px',
                color: '#1a1a1a',
                fontSize: '1.8rem',
                fontWeight: 'bold'
              }}>
                {selectedMonument.name}
              </h2>

              {/* Basic Info */}
              <div style={{
                marginBottom: '25px',
                padding: '15px',
                background: '#f8f9fa',
                borderRadius: '8px',
                borderLeft: '4px solid #8B4513'
              }}>
                <p style={{ marginBottom: '8px', fontSize: '0.95rem' }}>
                  <strong>📍 Location:</strong> {selectedMonument.location}
                </p>
                <p style={{ marginBottom: '8px', fontSize: '0.95rem' }}>
                  <strong>🏛️ Type:</strong> {selectedMonument.sect}
                </p>
                <p style={{ marginBottom: '0', fontSize: '0.95rem' }}>
                  <strong>📅 Founded:</strong> {selectedMonument.founded}
                </p>
              </div>

              {/* Detailed Information */}
              {selectedMonument.key && monumentData[selectedMonument.key] && (
                <>
                  {/* Overview */}
                  <div style={{ marginBottom: '25px' }}>
                    <h3 style={{
                      marginBottom: '12px',
                      color: '#8B4513',
                      fontSize: '1.3rem',
                      fontWeight: 'bold',
                      borderBottom: '2px solid #8B4513',
                      paddingBottom: '8px'
                    }}>
                      📖 Overview
                    </h3>
                    <p style={{
                      lineHeight: '1.8',
                      color: '#333',
                      textAlign: 'justify',
                      fontSize: '0.95rem'
                    }}>
                      {monumentData[selectedMonument.key].overview}
                    </p>
                  </div>

                  {/* History */}
                  <div style={{ marginBottom: '25px' }}>
                    <h3 style={{
                      marginBottom: '12px',
                      color: '#28a745',
                      fontSize: '1.3rem',
                      fontWeight: 'bold',
                      borderBottom: '2px solid #28a745',
                      paddingBottom: '8px'
                    }}>
                      🏛️ History
                    </h3>
                    <p style={{
                      lineHeight: '1.8',
                      color: '#333',
                      textAlign: 'justify',
                      fontSize: '0.95rem'
                    }}>
                      {monumentData[selectedMonument.key].history}
                    </p>
                  </div>

                  {/* Architecture */}
                  <div style={{ marginBottom: '25px' }}>
                    <h3 style={{
                      marginBottom: '12px',
                      color: '#fd7e14',
                      fontSize: '1.3rem',
                      fontWeight: 'bold',
                      borderBottom: '2px solid #fd7e14',
                      paddingBottom: '8px'
                    }}>
                      🏗️ Architecture
                    </h3>
                    <p style={{
                      lineHeight: '1.8',
                      color: '#333',
                      textAlign: 'justify',
                      fontSize: '0.95rem'
                    }}>
                      {monumentData[selectedMonument.key].architecture}
                    </p>
                  </div>

                  {/* Festivals */}
                  <div style={{ marginBottom: '25px' }}>
                    <h3 style={{
                      marginBottom: '12px',
                      color: '#dc3545',
                      fontSize: '1.3rem',
                      fontWeight: 'bold',
                      borderBottom: '2px solid #dc3545',
                      paddingBottom: '8px'
                    }}>
                      🎉 Festivals & Events
                    </h3>
                    <p style={{
                      lineHeight: '1.8',
                      color: '#333',
                      textAlign: 'justify',
                      fontSize: '0.95rem'
                    }}>
                      {monumentData[selectedMonument.key].festivals}
                    </p>
                  </div>

                  {/* Visiting Information */}
                  <div style={{
                    marginBottom: '20px',
                    padding: '20px',
                    background: '#FFF8DC',
                    borderRadius: '8px',
                    border: '1px solid #8B4513'
                  }}>
                    <h3 style={{
                      marginBottom: '12px',
                      color: '#8B4513',
                      fontSize: '1.3rem',
                      fontWeight: 'bold'
                    }}>
                      ℹ️ Visiting Information
                    </h3>
                    <p style={{
                      lineHeight: '1.8',
                      color: '#333',
                      marginBottom: 0,
                      fontSize: '0.95rem'
                    }}>
                      {monumentData[selectedMonument.key].visitingInfo}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <FloatingChatbot />
    </>
  );
};

export default Monasteries;
