const Itinerary = require('../models/Itinerary');

// Comprehensive Madhya Pradesh Heritage Sites with nearby attractions
const mpHeritageSites = [
  {
    name: "Khajuraho Temples",
    destination: "Khajuraho",
    district: "Chhatarpur",
    description: "UNESCO World Heritage Site with stunning temple architecture and intricate sculptures",
    nearbyPlaces: [
      "Western Group of Temples",
      "Eastern Group of Temples",
      "Archaeological Museum (2 km)",
      "Raneh Falls (20 km)",
      "Panna National Park (25 km)"
    ],
    activities: ["Temple exploration", "Photography", "Light and sound show"],
    bestTime: "October-March"
  },
  {
    name: "Mahakaleshwar Temple",
    destination: "Ujjain",
    district: "Ujjain",
    description: "One of the 12 Jyotirlingas, highly revered Shiva temple with unique Bhasma Aarti",
    nearbyPlaces: [
      "Kal Bhairav Temple (3 km)",
      "Ram Ghat (1 km)",
      "Harsiddhi Temple (2 km)",
      "Vikram Kirti Mandir (1.5 km)",
      "Sandipani Ashram (7 km)"
    ],
    activities: ["Temple darshan", "Bhasma Aarti", "Ghat visit"],
    bestTime: "October-March"
  },
  {
    name: "Gwalior Fort",
    destination: "Gwalior",
    district: "Gwalior",
    description: "One of India's most impregnable fortresses with magnificent palaces and temples",
    nearbyPlaces: [
      "Man Singh Palace",
      "Sas Bahu Temples",
      "Teli ka Mandir",
      "Gujari Mahal Museum",
      "Jai Vilas Palace (5 km)"
    ],
    activities: ["Fort exploration", "Sound and light show", "Heritage photography"],
    bestTime: "October-March"
  },
  {
    name: "Sanchi Stupa",
    destination: "Sanchi",
    district: "Raisen",
    description: "Ancient Buddhist complex commissioned by Emperor Ashoka, UNESCO World Heritage Site",
    nearbyPlaces: [
      "Great Stupa",
      "Sanchi Museum",
      "Udayagiri Caves (10 km)",
      "Bhimbetka Rock Shelters (45 km)",
      "Bhojpur Temple (40 km)"
    ],
    activities: ["Buddhist site exploration", "Photography", "Museum visit"],
    bestTime: "October-March"
  },
  {
    name: "Orchha Fort Complex",
    destination: "Orchha",
    district: "Tikamgarh",
    description: "Medieval fort complex showcasing Bundela Rajput architecture",
    nearbyPlaces: [
      "Raja Mahal",
      "Jahangir Mahal",
      "Ram Raja Temple",
      "Chaturbhuj Temple",
      "Betwa River Cenotaphs"
    ],
    activities: ["Heritage walk", "River rafting", "Cenotaph visit"],
    bestTime: "October-March"
  },
  {
    name: "Omkareshwar Temple",
    destination: "Omkareshwar",
    district: "Khandwa",
    description: "Sacred Jyotirlinga temple on an island shaped like Om symbol",
    nearbyPlaces: [
      "Mamleshwar Temple",
      "Narmada Parikrama",
      "Siddhanath Temple",
      "Kajal Rani Cave",
      "24 Avatars Group"
    ],
    activities: ["Temple darshan", "Island parikrama", "Boat ride"],
    bestTime: "October-March"
  },
  {
    name: "Jahaz Mahal",
    destination: "Mandu",
    district: "Dhar",
    description: "Ship Palace in Mandu appearing to float between two lakes",
    nearbyPlaces: [
      "Hindola Mahal",
      "Jami Masjid",
      "Roopmati Pavilion",
      "Baz Bahadur Palace",
      "Hoshang Shah's Tomb"
    ],
    activities: ["Heritage exploration", "Sunset viewing", "Afghan architecture study"],
    bestTime: "October-March"
  },
  {
    name: "Bhimbetka Rock Shelters",
    destination: "Bhimbetka",
    district: "Raisen",
    description: "UNESCO site with ancient rock paintings over 30,000 years old",
    nearbyPlaces: [
      "Rock Shelter Circuit",
      "Archaeological Museum",
      "Sanchi Stupa (45 km)",
      "Ratapani Wildlife Sanctuary (15 km)",
      "Van Vihar (45 km)"
    ],
    activities: ["Prehistoric art viewing", "Nature walk", "Photography"],
    bestTime: "October-March"
  },
  {
    name: "Ujjain Temples",
    destination: "Ujjain",
    district: "Ujjain",
    description: "Ancient city with multiple temples and ghats along Shipra River",
    nearbyPlaces: [
      "Mahakaleshwar Temple",
      "Kal Bhairav Temple",
      "Harsiddhi Temple",
      "Chintaman Ganesh",
      "ISKCON Temple"
    ],
    activities: ["Temple circuit", "Ghat exploration", "Kumbh Mela (periodic)"],
    bestTime: "October-March"
  }
];

// @desc    Generate itinerary - simplified version
// @route   POST /api/itinerary/generate
// @access  Private
exports.generateItinerary = async (req, res) => {
  try {
    const {
      days,
      travel_experience,
      budget_category,
      season,
      weather_condition,
      stay_type,
      food_preference,
      recommended_transport
    } = req.body;

    // Validate days
    const itineraryDays = days || 3;
    if (itineraryDays < 1 || itineraryDays > 10) {
      return res.status(400).json({
        success: false,
        message: 'Days must be between 1 and 10'
      });
    }

    // Select heritage sites based on number of days (one per day, excluding first and last)
    const numSites = Math.max(1, itineraryDays - 1); // Reserve last day for departure
    const selectedSites = [];
    const availableSites = [...mpHeritageSites];

    for (let i = 0; i < Math.min(numSites, availableSites.length); i++) {
      const randomIndex = Math.floor(Math.random() * availableSites.length);
      selectedSites.push(availableSites.splice(randomIndex, 1)[0]);
    }

    // Calculate cost based on budget
    const costMap = { Low: 2000, Medium: 3500, High: 5500, Luxury: 8000 };
    const dailyCost = costMap[budget_category] || 3500;

    // Generate detailed day-wise plan with heritage site visits and nearby places
    let planText = '';
    let currentSiteIndex = 0;

    for (let i = 1; i <= itineraryDays; i++) {
      planText += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
      planText += `DAY ${i}`;

      if (i === 1) {
        // Arrival Day
        const firstSite = selectedSites[0];
        planText += ` - Arrival at ${firstSite.destination}\n`;
        planText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        planText += `📍 Destination: ${firstSite.district}\n\n`;
        planText += `Morning (9:00 AM - 12:00 PM):\n`;
        planText += `• Arrive at nearest airport/railway station\n`;
        planText += `• Transfer to ${firstSite.destination} by ${recommended_transport || 'taxi'}\n`;
        planText += `• Check-in at ${stay_type || 'hotel'}\n\n`;
        planText += `Afternoon (12:00 PM - 5:00 PM):\n`;
        planText += `• Lunch with local ${food_preference || 'Both'} cuisine\n`;
        planText += `• Visit ${firstSite.name}\n`;
        planText += `• ${firstSite.description}\n`;
        planText += `• Explore heritage site grounds\n\n`;
        planText += `Evening (5:00 PM - 8:00 PM):\n`;
        planText += `• Nearby attractions: ${firstSite.nearbyPlaces[0]}\n`;
        planText += `• Welcome dinner and orientation\n`;
        planText += `• Rest and acclimatization\n`;
        currentSiteIndex++;

      } else if (i === itineraryDays) {
        // Departure Day
        const lastSite = selectedSites[currentSiteIndex - 1];
        planText += ` - Departure\n`;
        planText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        planText += `Morning (7:00 AM - 11:00 AM):\n`;
        planText += `• Early breakfast and hotel check-out\n`;
        planText += `• Final visit to ${lastSite.name}\n`;
        planText += `• Shopping for souvenirs and local handicrafts\n\n`;
        planText += `Afternoon (11:00 AM - 2:00 PM):\n`;
        planText += `• Farewell lunch\n`;
        planText += `• Transfer to Airport/Station\n`;
        planText += `• Departure with wonderful memories\n`;

      } else {
        // Full exploration days
        const site = selectedSites[currentSiteIndex];
        planText += ` - ${site.name} & Surroundings\n`;
        planText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        planText += `📍 Location: ${site.district}\n`;
        planText += `🏛️  Heritage Site: ${site.name}\n\n`;

        planText += `Morning (7:00 AM - 12:00 PM):\n`;
        planText += `• Early morning visit to ${site.name}\n`;
        planText += `• ${site.description}\n`;
        planText += `• Photography and architectural exploration\n\n`;

        planText += `Afternoon (12:00 PM - 5:00 PM):\n`;
        planText += `• Traditional lunch at local restaurant\n`;
        planText += `• Visit nearby attractions:\n`;
        site.nearbyPlaces.slice(0, 3).forEach(place => {
          planText += `  ✓ ${place}\n`;
        });
        planText += `• ${site.activities.join(', ')}\n\n`;

        planText += `Evening (5:00 PM - 8:00 PM):\n`;
        planText += `• Sunset viewing at scenic points\n`;
        if (site.nearbyPlaces.length > 3) {
          planText += `• Optional visit: ${site.nearbyPlaces[3]}\n`;
        }
        planText += `• Dinner and leisure time\n`;

        currentSiteIndex++;
      }
    }

    // Prepare monastery list for database
    const siteList = selectedSites.map((m, idx) => ({
      name: m.name,
      location: m.district,
      day: idx + 1,
      nearestTown: m.destination,
      experiences: m.activities
    }));

    // Create comprehensive destination summary
    const destinations = [...new Set(selectedSites.map(m => m.destination))].join(', ');
    const allNearbyPlaces = selectedSites.flatMap(m => m.nearbyPlaces.slice(0, 2)).join(', ');

    // Create itinerary in database
    const itinerary = await Itinerary.create({
      userId: req.user.id,
      userName: req.user.name,
      days: itineraryDays,
      destination: destinations,
      monastery_name: selectedSites.map(m => m.name).join(', '),
      travel_experience: travel_experience || 'Cultural',
      budget_category: budget_category || 'Medium',
      season: season || 'Spring',
      weather_condition: weather_condition || 'Clear',
      stay_type: stay_type || 'Hotel',
      food_preference: food_preference || 'Both',
      recommended_transport: recommended_transport || 'Taxi',
      activity_type: `Visit ${selectedSites.length} heritage sites with nearby attractions`,
      daily_plan: planText,
      estimated_daily_cost_inr: dailyCost,
      notes: `This ${itineraryDays}-day tour covers ${selectedSites.length} major heritage sites across Madhya Pradesh. Nearby attractions include: ${allNearbyPlaces}. Best time to visit: ${season || 'Winter'} season.`,
      title: `${itineraryDays}-Day Madhya Pradesh Heritage Circuit`,
      monasteries: siteList
    });

    res.status(201).json({
      success: true,
      message: 'Itinerary generated successfully',
      itinerary
    });
  } catch (error) {
    console.error('Error generating itinerary:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Search itineraries with filters
// @route   GET /api/itinerary/search
// @access  Public
exports.searchItineraries = async (req, res) => {
  try {
    const {
      travel_experience,
      budget_category,
      season,
      days,
      destination,
      stay_type,
      food_preference
    } = req.query;

    const filter = {};

    if (travel_experience) filter.travel_experience = travel_experience;
    if (budget_category) filter.budget_category = budget_category;
    if (season) filter.season = season;
    if (days) filter.days = parseInt(days);
    if (destination) filter.destination = new RegExp(destination, 'i');
    if (stay_type) filter.stay_type = stay_type;
    if (food_preference) filter.food_preference = food_preference;

    const itineraries = await Itinerary.find(filter)
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: itineraries.length,
      itineraries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user's itineraries
// @route   GET /api/itinerary/my-itineraries
// @access  Private
exports.getMyItineraries = async (req, res) => {
  try {
    const itineraries = await Itinerary.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: itineraries.length,
      itineraries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single itinerary
// @route   GET /api/itinerary/:id
// @access  Private
exports.getItinerary = async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);

    if (!itinerary) {
      return res.status(404).json({
        success: false,
        message: 'Itinerary not found'
      });
    }

    // Check authorization
    if (itinerary.userId.toString() !== req.user.id && !itinerary.isPublic) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this itinerary'
      });
    }

    res.status(200).json({
      success: true,
      itinerary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete itinerary
// @route   DELETE /api/itinerary/:id
// @access  Private
exports.deleteItinerary = async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);

    if (!itinerary) {
      return res.status(404).json({
        success: false,
        message: 'Itinerary not found'
      });
    }

    // Check authorization
    if (itinerary.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this itinerary'
      });
    }

    await itinerary.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Itinerary deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
