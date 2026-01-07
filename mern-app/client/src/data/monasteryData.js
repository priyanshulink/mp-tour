// Heritage Temple data for offline chatbot - Madhya Pradesh
export const monasteries = [
  { 
    name: "Khajuraho Temples", 
    location: "Khajuraho, Chhatarpur District", 
    sect: "Hindu", 
    founded: "950-1050 CE", 
    history: "UNESCO World Heritage Site known for stunning sculptures and architecture. Built by Chandela dynasty rulers.", 
    wiki: "https://en.wikipedia.org/wiki/Khajuraho_Group_of_Monuments" 
  },
  { 
    name: "Mahakaleshwar Temple", 
    location: "Ujjain, Madhya Pradesh", 
    sect: "Hindu (Shaivism)", 
    founded: "Ancient (Current structure 18th century)", 
    history: "One of the 12 Jyotirlingas, highly revered Shiva temple with unique southward facing lingam.", 
    wiki: "https://en.wikipedia.org/wiki/Mahakaleshwar_Jyotirlinga" 
  },
  { 
    name: "Omkareshwar Temple", 
    location: "Omkareshwar, Khandwa District", 
    sect: "Hindu (Shaivism)", 
    founded: "Ancient", 
    history: "Sacred Jyotirlinga temple on an island shaped like Hindu 'Om' symbol on the Narmada River.", 
    wiki: "https://en.wikipedia.org/wiki/Omkareshwar" 
  },
  { 
    name: "Sanchi Stupa", 
    location: "Sanchi, Raisen District", 
    sect: "Buddhist", 
    founded: "3rd century BCE", 
    history: "Ancient Buddhist complex commissioned by Emperor Ashoka. UNESCO World Heritage Site.", 
    wiki: "https://en.wikipedia.org/wiki/Sanchi" 
  },
  { 
    name: "Bhimbetka Rock Shelters", 
    location: "Raisen District", 
    sect: "Ancient Heritage", 
    founded: "Paleolithic Age", 
    history: "UNESCO World Heritage Site with ancient rock paintings dating back over 30,000 years.", 
    wiki: "https://en.wikipedia.org/wiki/Bhimbetka_rock_shelters" 
  },
  { 
    name: "Gwalior Fort", 
    location: "Gwalior, Madhya Pradesh", 
    sect: "Historical Monument", 
    founded: "8th century", 
    history: "One of India's most impregnable fortresses with magnificent palaces and temples.", 
    wiki: "https://en.wikipedia.org/wiki/Gwalior_Fort" 
  },
  { 
    name: "Chaturbhuj Temple", 
    location: "Orchha, Tikamgarh District", 
    sect: "Hindu (Vaishnavism)", 
    founded: "16th century", 
    history: "Unique temple with a blend of palace, fort, and temple architecture.", 
    wiki: "https://en.wikipedia.org/wiki/Orchha" 
  },
  { 
    name: "Jahaz Mahal", 
    location: "Mandu, Dhar District", 
    sect: "Historical Monument", 
    founded: "15th century", 
    history: "Ship Palace built during Afghan rule, appearing to float between two artificial lakes.", 
    wiki: "https://en.wikipedia.org/wiki/Jahaz_Mahal" 
  },
  { 
    name: "Kandariya Mahadev Temple", 
    location: "Khajuraho, Chhatarpur District", 
    sect: "Hindu (Shaivism)", 
    founded: "1030 CE", 
    history: "Largest and most ornate temple in Khajuraho, epitome of Chandela architecture.", 
    wiki: "https://en.wikipedia.org/wiki/Kandariya_Mahadeva_Temple" 
  },
  { 
    name: "Udayagiri Caves", 
    location: "Vidisha, Madhya Pradesh", 
    sect: "Hindu/Jain", 
    founded: "Early 5th century CE", 
    history: "Rock-cut caves with important Hindu iconography from Gupta period.", 
    wiki: "https://en.wikipedia.org/wiki/Udayagiri_Caves" 
  },
  { 
    name: "Mandu Fort Complex", 
    location: "Mandu, Dhar District", 
    sect: "Historical Monument", 
    founded: "15th-16th century", 
    history: "Afghan architecture showcase with palaces, mosques and monuments.", 
    wiki: "https://en.wikipedia.org/wiki/Mandu,_Madhya_Pradesh" 
  },
  { 
    name: "Dhar Fort", 
    location: "Dhar, Madhya Pradesh", 
    sect: "Historical Monument", 
    founded: "11th century", 
    history: "Ancient fort with rich Paramara and Malwa Sultanate heritage.", 
    wiki: "https://en.wikipedia.org/wiki/Dhar" 
  },
  { 
    name: "Bhojpur Temple", 
    location: "Bhojpur, Raisen District", 
    sect: "Hindu (Shaivism)", 
    founded: "11th century", 
    history: "Incomplete temple with one of India's largest Shiva lingams, built by Raja Bhoja.", 
    wiki: "https://en.wikipedia.org/wiki/Bhojpur,_Madhya_Pradesh" 
  },
  { 
    name: "Orchha Fort Complex", 
    location: "Orchha, Tikamgarh District", 
    sect: "Historical Monument", 
    founded: "16th century", 
    history: "Medieval fort complex with palaces showcasing Bundela architecture.", 
    wiki: "https://en.wikipedia.org/wiki/Orchha_Fort_complex" 
  },
  { 
    name: "Jain Temples of Sonagiri", 
    location: "Sonagiri, Datia District", 
    sect: "Jain", 
    founded: "Ancient", 
    history: "Important Jain pilgrimage site with white temples on a hilltop.", 
    wiki: "https://en.wikipedia.org/wiki/Sonagiri" 
  }
];

// Helper function to get all unique types
export const getSects = () => {
  return [...new Set(monasteries.map(m => m.sect))];
};

// Helper function to get monuments by type
export const getMonasteriesBySect = (sect) => {
  return monasteries.filter(m => m.sect.toLowerCase() === sect.toLowerCase());
};

// Helper function to get monuments by location
export const getMonasteriesByLocation = (location) => {
  return monasteries.filter(m => 
    m.location.toLowerCase().includes(location.toLowerCase())
  );
};

// Helper function to find monument by name
export const findMonasteryByName = (name) => {
  return monasteries.find(m => 
    m.name.toLowerCase().includes(name.toLowerCase())
  );
};
