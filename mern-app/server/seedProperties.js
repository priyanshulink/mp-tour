const mongoose = require('mongoose');
const Property = require('./models/Property');
const Availability = require('./models/Availability');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/monastery-heritage')
  .then(() => console.log('✅ MongoDB connected for seeding'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Demo properties data
const demoProperties = [
  {
    propertyId: "MPT2026001",
    name: "Royal Heritage Palace",
    type: "heritage",
    category: "luxury",
    description: {
      short: "Experience royal Madhya Pradesh in this restored 18th-century palace with traditional architecture and modern amenities.",
      detailed: "Experience royal Madhya Pradesh in this restored 18th-century palace. Featuring traditional architecture, antique furnishings, and modern amenities, our heritage property offers an unforgettable stay. Each room is decorated with period furniture, the palace features beautiful courtyards, and guests can enjoy cultural programs in the evening."
    },
    location: {
      address: "Palace Road, Near Gwalior Fort",
      city: "Gwalior",
      district: "Gwalior",
      state: "Madhya Pradesh",
      pincode: "474001",
      tourismCircuit: "Chambal",
      coordinates: {
        latitude: 26.2183,
        longitude: 78.1828
      }
    },
    images: [
      {url: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800", caption: "Palace Exterior", isPrimary: true},
      {url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800", caption: "Royal Courtyard", isPrimary: false},
      {url: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800", caption: "Heritage Room", isPrimary: false},
      {url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800", caption: "Palace Gardens", isPrimary: false}
    ],
    rooms: [
      {
        roomType: "Maharaja Suite",
        basePrice: 8500,
        capacity: 2,
        totalRooms: 3,
        amenities: ["King Bed", "Air Conditioning", "Mini Bar", "Heritage Decor", "Butler Service"]
      },
      {
        roomType: "Royal Deluxe Room",
        basePrice: 5500,
        capacity: 2,
        totalRooms: 8,
        amenities: ["Queen Bed", "Air Conditioning", "WiFi", "Heritage Furniture"]
      }
    ],
    totalCapacity: 22,
    amenities: {
      basic: ["WiFi", "Air Conditioning", "Room Service", "Daily Housekeeping"],
      facilities: ["Restaurant", "Heritage Museum", "Garden", "Palace Tour", "Cultural Programs"],
      accessibility: ["Wheelchair Access", "Elevator", "Ramp Access"]
    },
    policies: {
      checkInTime: "14:00",
      checkOutTime: "11:00",
      cancellationPolicy: {
        moreThan7Days: 100,
        between3To7Days: 50,
        lessThan3Days: 25,
        lessThan1Day: 0
      },
      houseRules: [
        "No smoking inside palace rooms",
        "Respectful behavior in heritage areas",
        "Photography allowed in designated areas",
        "Palace tour included with stay"
      ]
    },
    pricing: {
      seasonalRates: [
        {
          name: "Peak Season (Oct-Mar)",
          startDate: new Date('2026-10-01'),
          endDate: new Date('2027-03-31'),
          multiplier: 1.4
        },
        {
          name: "Festival Season",
          startDate: new Date('2026-12-20'),
          endDate: new Date('2027-01-05'),
          multiplier: 1.6
        }
      ],
      weekendMultiplier: 1.2,
      gstRate: 18
    },
    ratings: {
      overall: 4.8,
      cleanliness: 4.9,
      amenities: 4.7,
      location: 4.8,
      service: 4.9,
      value: 4.6,
      totalReviews: 127
    },
    approvalStatus: "approved",
    isFeatured: true,
    isVerified: true
  },
  {
    name: "Lakeside Eco Resort",
    type: "eco-lodge",
    category: "mid-range",
    description: "Sustainable eco-resort nestled by the serene Bhojtal Lake. Solar-powered cottages, organic farm, and nature trails offer a perfect eco-tourism experience.",
    location: {
      address: "VIP Road, Bhojtal Lake Area",
      city: "Bhopal",
      state: "Madhya Pradesh",
      pincode: "462026",
      tourismCircuit: "Bhopal Circuit",
      coordinates: {
        latitude: 23.2599,
        longitude: 77.4126
      }
    },
    owner: null,
    images: [
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
      "https://images.unsplash.com/photo-1542259009477-d625272157b7?w=800"
    ],
    rooms: [
      {
        type: "Eco Cottage",
        description: "Bamboo cottage with lake view, solar power, and natural ventilation",
        basePrice: 3200,
        capacity: 3,
        count: 10,
        amenities: ["Solar Power", "Lake View", "Natural Ventilation", "Organic Toiletries", "Mosquito Nets"]
      },
      {
        type: "Family Eco Villa",
        description: "Spacious villa for families with organic garden access",
        basePrice: 5500,
        capacity: 5,
        count: 5,
        amenities: ["Two Bedrooms", "Solar Power", "Kitchen", "Garden Access", "BBQ Area"]
      }
    ],
    amenities: {
      basic: ["Eco-friendly Toiletries", "Natural Cooling", "Mosquito Protection"],
      facilities: ["Organic Restaurant", "Nature Trails", "Kayaking", "Bird Watching", "Organic Farm Tour", "Yoga Deck"],
      accessibility: ["Nature Friendly Paths"]
    },
    policies: {
      checkInTime: "14:00",
      checkOutTime: "11:00",
      cancellationPolicy: {
        moreThan7Days: 100,
        between3To7Days: 60,
        lessThan3Days: 30,
        lessThan1Day: 0
      },
      houseRules: [
        "No plastic bottles or bags",
        "Respect wildlife and nature",
        "Use eco-friendly products only",
        "Participate in tree planting activities"
      ]
    },
    pricing: {
      seasonalRates: [
        {
          name: "Peak Season",
          startDate: new Date('2026-10-01'),
          endDate: new Date('2027-03-31'),
          multiplier: 1.3
        }
      ],
      weekendMultiplier: 1.15,
      gstRate: 12
    },
    ratings: {
      overall: 4.6,
      cleanliness: 4.7,
      amenities: 4.4,
      location: 4.8,
      service: 4.6,
      value: 4.7,
      totalReviews: 89
    },
    approvalStatus: "approved",
    isFeatured: true,
    isVerified: true
  },
  {
    name: "Narmada River Resort",
    type: "resort",
    category: "luxury",
    description: "Luxury resort on the banks of holy Narmada River. Offers premium accommodation, spa, adventure sports, and spiritual experiences.",
    location: {
      address: "River Front, Narmada Road",
      city: "Jabalpur",
      state: "Madhya Pradesh",
      pincode: "482001",
      tourismCircuit: "Marble Rocks Circuit",
      coordinates: {
        latitude: 23.1815,
        longitude: 79.9864
      }
    },
    owner: null,
    images: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800"
    ],
    rooms: [
      {
        type: "River View Premium",
        description: "Luxurious room with panoramic Narmada river views and private balcony",
        basePrice: 6500,
        capacity: 2,
        count: 15,
        amenities: ["King Bed", "River View", "Balcony", "Mini Bar", "Smart TV"]
      },
      {
        type: "Family Suite",
        description: "Spacious two-bedroom suite with living area and river views",
        basePrice: 9500,
        capacity: 4,
        count: 8,
        amenities: ["Two Bedrooms", "Living Room", "River View", "Dining Area", "Kitchenette"]
      },
      {
        type: "Deluxe Room",
        description: "Comfortable room with modern amenities and garden view",
        basePrice: 4500,
        capacity: 2,
        count: 20,
        amenities: ["Queen Bed", "Garden View", "Smart TV", "Work Desk"]
      }
    ],
    amenities: {
      basic: ["WiFi", "Air Conditioning", "Room Service", "Daily Housekeeping", "Welcome Drink"],
      facilities: ["Swimming Pool", "Spa & Wellness", "Multi-Cuisine Restaurant", "Adventure Sports", "River Rafting", "Gym", "Banquet Hall", "Kids Play Area"],
      accessibility: ["Wheelchair Access", "Elevator", "Special Needs Assistance"]
    },
    policies: {
      checkInTime: "14:00",
      checkOutTime: "12:00",
      cancellationPolicy: {
        moreThan7Days: 100,
        between3To7Days: 50,
        lessThan3Days: 20,
        lessThan1Day: 0
      },
      houseRules: [
        "Pool access: 6 AM - 8 PM",
        "Spa reservations required",
        "Adventure activities subject to weather",
        "River safety guidelines must be followed"
      ]
    },
    pricing: {
      seasonalRates: [
        {
          name: "Peak Season",
          startDate: new Date('2026-10-01'),
          endDate: new Date('2027-03-31'),
          multiplier: 1.5
        }
      ],
      weekendMultiplier: 1.25,
      gstRate: 18
    },
    ratings: {
      overall: 4.7,
      cleanliness: 4.8,
      amenities: 4.8,
      location: 4.9,
      service: 4.7,
      value: 4.5,
      totalReviews: 203
    },
    approvalStatus: "approved",
    isFeatured: true,
    isVerified: true
  },
  {
    name: "Temple View Homestay",
    type: "homestay",
    category: "budget",
    description: "Cozy homestay with stunning views of Mahakaleshwar Temple. Experience authentic Ujjain culture with home-cooked meals and warm hospitality.",
    location: {
      address: "Near Mahakaleshwar Temple, Old City",
      city: "Ujjain",
      state: "Madhya Pradesh",
      pincode: "456001",
      tourismCircuit: "Malwa Circuit",
      coordinates: {
        latitude: 23.1765,
        longitude: 75.7683
      }
    },
    owner: null,
    images: [
      "https://images.unsplash.com/photo-1502672260066-6bc35f0a9e76?w=800",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
      "https://images.unsplash.com/photo-1615874694520-474822394e73?w=800"
    ],
    rooms: [
      {
        type: "Deluxe Room",
        description: "Comfortable room with temple view and traditional decor",
        basePrice: 1500,
        capacity: 2,
        count: 4,
        amenities: ["Double Bed", "Temple View", "Fan", "Attached Bathroom", "Traditional Decor"]
      },
      {
        type: "Family Room",
        description: "Spacious room for families with extra beds",
        basePrice: 2200,
        capacity: 4,
        count: 2,
        amenities: ["Two Beds", "Extra Mattress", "Fan", "Attached Bathroom", "Sitting Area"]
      }
    ],
    amenities: {
      basic: ["WiFi", "Hot Water", "Home Cooked Meals", "Laundry Service"],
      facilities: ["Rooftop Terrace", "Temple Tour Guide", "Prayer Room", "Local Cuisine Classes", "Parking"],
      accessibility: ["Ground Floor Rooms Available"]
    },
    policies: {
      checkInTime: "12:00",
      checkOutTime: "11:00",
      cancellationPolicy: {
        moreThan7Days: 100,
        between3To7Days: 70,
        lessThan3Days: 40,
        lessThan1Day: 0
      },
      houseRules: [
        "Respect prayer times and silence hours",
        "No alcohol or non-vegetarian food",
        "Temple etiquette to be followed",
        "Early morning temple visits arranged"
      ]
    },
    pricing: {
      seasonalRates: [
        {
          name: "Festival Season",
          startDate: new Date('2026-02-15'),
          endDate: new Date('2026-03-15'),
          multiplier: 1.8
        }
      ],
      weekendMultiplier: 1.1,
      gstRate: 12
    },
    ratings: {
      overall: 4.5,
      cleanliness: 4.6,
      amenities: 4.2,
      location: 4.9,
      service: 4.8,
      value: 4.7,
      totalReviews: 56
    },
    approvalStatus: "approved",
    isFeatured: false,
    isVerified: true
  },
  {
    name: "Business Hub Hotel",
    type: "hotel",
    category: "mid-range",
    description: "Modern business hotel in the heart of Indore. Perfect for business travelers with conference facilities, high-speed internet, and airport connectivity.",
    location: {
      address: "MG Road, Business District",
      city: "Indore",
      state: "Madhya Pradesh",
      pincode: "452001",
      tourismCircuit: "Indore Circuit",
      coordinates: {
        latitude: 22.7196,
        longitude: 75.8577
      }
    },
    owner: null,
    images: [
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800"
    ],
    rooms: [
      {
        type: "Executive Room",
        description: "Well-appointed room with work desk and business amenities",
        basePrice: 3200,
        capacity: 2,
        count: 25,
        amenities: ["King Bed", "Work Desk", "High-speed WiFi", "Smart TV", "Mini Bar"]
      },
      {
        type: "Standard Room",
        description: "Comfortable room with essential amenities",
        basePrice: 2400,
        capacity: 2,
        count: 30,
        amenities: ["Queen Bed", "WiFi", "TV", "Work Desk", "Coffee Maker"]
      },
      {
        type: "Business Suite",
        description: "Spacious suite with separate living and work areas",
        basePrice: 5500,
        capacity: 2,
        count: 10,
        amenities: ["King Bed", "Living Room", "Office Space", "Smart TV", "Mini Bar", "Premium WiFi"]
      }
    ],
    amenities: {
      basic: ["WiFi", "Air Conditioning", "24x7 Room Service", "Daily Housekeeping", "Newspaper"],
      facilities: ["Conference Rooms", "Business Center", "Restaurant", "Cafe", "Gym", "Airport Shuttle", "Parking", "Laundry"],
      accessibility: ["Wheelchair Access", "Elevator", "Braille Signage"]
    },
    policies: {
      checkInTime: "14:00",
      checkOutTime: "12:00",
      cancellationPolicy: {
        moreThan7Days: 100,
        between3To7Days: 50,
        lessThan3Days: 25,
        lessThan1Day: 0
      },
      houseRules: [
        "24x7 check-in available",
        "Conference rooms require advance booking",
        "Airport shuttle on request",
        "Late checkout subject to availability"
      ]
    },
    pricing: {
      seasonalRates: [],
      weekendMultiplier: 1.1,
      gstRate: 12
    },
    ratings: {
      overall: 4.3,
      cleanliness: 4.4,
      amenities: 4.3,
      location: 4.6,
      service: 4.2,
      value: 4.4,
      totalReviews: 178
    },
    approvalStatus: "approved",
    isFeatured: false,
    isVerified: true
  },
  {
    name: "Khajuraho Heritage Resort",
    type: "resort",
    category: "luxury",
    description: "Luxury resort near the world-famous Khajuraho temples. Featuring temple-inspired architecture, cultural performances, and premium amenities.",
    location: {
      address: "Temple Circuit Road, Near Western Group",
      city: "Khajuraho",
      state: "Madhya Pradesh",
      pincode: "471606",
      tourismCircuit: "Khajuraho Circuit",
      coordinates: {
        latitude: 24.8318,
        longitude: 79.9199
      }
    },
    owner: null,
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800"
    ],
    rooms: [
      {
        type: "Heritage Suite",
        description: "Luxurious suite with temple-inspired architecture and premium amenities",
        basePrice: 7500,
        capacity: 2,
        count: 12,
        amenities: ["King Bed", "Temple View", "Private Balcony", "Jacuzzi", "Mini Bar", "Butler Service"]
      },
      {
        type: "Deluxe Room",
        description: "Spacious room with traditional decor and modern comforts",
        basePrice: 5000,
        capacity: 2,
        count: 20,
        amenities: ["Queen Bed", "Garden View", "Smart TV", "Mini Bar", "Bathtub"]
      },
      {
        type: "Garden Villa",
        description: "Private villa with garden, perfect for families",
        basePrice: 10000,
        capacity: 4,
        count: 6,
        amenities: ["Two Bedrooms", "Private Garden", "Living Room", "Kitchen", "BBQ Area"]
      }
    ],
    amenities: {
      basic: ["WiFi", "Air Conditioning", "Room Service", "Daily Housekeeping", "Welcome Amenities"],
      facilities: ["Swimming Pool", "Spa", "Multi-Cuisine Restaurant", "Cultural Dance Shows", "Temple Tour", "Yoga Sessions", "Gym", "Library"],
      accessibility: ["Wheelchair Access", "Elevator", "Special Needs Rooms"]
    },
    policies: {
      checkInTime: "14:00",
      checkOutTime: "12:00",
      cancellationPolicy: {
        moreThan7Days: 100,
        between3To7Days: 50,
        lessThan3Days: 25,
        lessThan1Day: 0
      },
      houseRules: [
        "Cultural dance shows at 7 PM daily",
        "Temple visits arranged",
        "Yoga sessions at sunrise",
        "Photography of temples permitted"
      ]
    },
    pricing: {
      seasonalRates: [
        {
          name: "Peak Season",
          startDate: new Date('2026-10-01'),
          endDate: new Date('2027-03-31'),
          multiplier: 1.6
        },
        {
          name: "Dance Festival",
          startDate: new Date('2027-02-20'),
          endDate: new Date('2027-03-01'),
          multiplier: 2.0
        }
      ],
      weekendMultiplier: 1.2,
      gstRate: 18
    },
    ratings: {
      overall: 4.9,
      cleanliness: 4.9,
      amenities: 4.8,
      location: 5.0,
      service: 4.9,
      value: 4.7,
      totalReviews: 245
    },
    approvalStatus: "approved",
    isFeatured: true,
    isVerified: true
  },
  {
    name: "Countryside Farm Stay",
    type: "homestay",
    category: "budget",
    description: "Authentic farm stay experience in rural Madhya Pradesh. Participate in farming activities, enjoy organic meals, and experience village life.",
    location: {
      address: "Village Khermai, Near Sanchi Stupa",
      city: "Raisen",
      state: "Madhya Pradesh",
      pincode: "464551",
      tourismCircuit: "Buddhist Circuit",
      coordinates: {
        latitude: 23.4799,
        longitude: 77.7394
      }
    },
    owner: null,
    images: [
      "https://images.unsplash.com/photo-1500076656116-558758c991c1?w=800",
      "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800",
      "https://images.unsplash.com/photo-1542401886-65d6c61db217?w=800",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800"
    ],
    rooms: [
      {
        type: "Farm Cottage",
        description: "Rustic cottage with basic amenities and farm views",
        basePrice: 1200,
        capacity: 2,
        count: 5,
        amenities: ["Double Bed", "Farm View", "Fan", "Attached Bathroom", "Mosquito Net"]
      },
      {
        type: "Family Cottage",
        description: "Larger cottage for families with kitchen access",
        basePrice: 1800,
        capacity: 4,
        count: 3,
        amenities: ["Two Beds", "Kitchen Access", "Farm View", "Sitting Area", "Outdoor Space"]
      }
    ],
    amenities: {
      basic: ["Organic Meals", "Hot Water", "Laundry", "Farm Fresh Produce"],
      facilities: ["Farm Tour", "Bullock Cart Ride", "Village Walk", "Cooking Classes", "Organic Garden", "Bonfire", "Star Gazing"],
      accessibility: ["Ground Floor Access"]
    },
    policies: {
      checkInTime: "12:00",
      checkOutTime: "11:00",
      cancellationPolicy: {
        moreThan7Days: 100,
        between3To7Days: 75,
        lessThan3Days: 50,
        lessThan1Day: 25
      },
      houseRules: [
        "Participate in farm activities",
        "Respect farm animals and plants",
        "Vegetarian meals only",
        "Early morning farm tours available",
        "Children supervision required near animals"
      ]
    },
    pricing: {
      seasonalRates: [
        {
          name: "Harvest Season",
          startDate: new Date('2026-11-01'),
          endDate: new Date('2026-12-31'),
          multiplier: 1.2
        }
      ],
      weekendMultiplier: 1.15,
      gstRate: 0
    },
    ratings: {
      overall: 4.7,
      cleanliness: 4.5,
      amenities: 4.3,
      location: 4.6,
      service: 4.9,
      value: 4.9,
      totalReviews: 42
    },
    approvalStatus: "approved",
    isFeatured: false,
    isVerified: true
  },
  {
    name: "Pachmarhi Hill Station Retreat",
    type: "resort",
    category: "mid-range",
    description: "Scenic mountain resort in Pachmarhi hill station. Perfect for nature lovers with valley views, waterfalls nearby, and adventure activities.",
    location: {
      address: "Valley View Road, Near Bee Fall",
      city: "Pachmarhi",
      state: "Madhya Pradesh",
      pincode: "461881",
      tourismCircuit: "Satpura Circuit",
      coordinates: {
        latitude: 22.4676,
        longitude: 78.4322
      }
    },
    owner: null,
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800"
    ],
    rooms: [
      {
        type: "Valley View Room",
        description: "Room with panoramic valley views and mountain breeze",
        basePrice: 3800,
        capacity: 2,
        count: 15,
        amenities: ["Queen Bed", "Valley View", "Balcony", "Heater", "Hot Water"]
      },
      {
        type: "Mountain Suite",
        description: "Spacious suite with living area and mountain views",
        basePrice: 5500,
        capacity: 3,
        count: 8,
        amenities: ["King Bed", "Living Room", "Mountain View", "Fireplace", "Mini Bar"]
      },
      {
        type: "Family Cottage",
        description: "Cozy cottage for families with garden",
        basePrice: 4800,
        capacity: 4,
        count: 10,
        amenities: ["Two Bedrooms", "Garden", "Kitchen", "BBQ Area", "Kids Play Area"]
      }
    ],
    amenities: {
      basic: ["WiFi", "Hot Water", "Room Service", "Daily Housekeeping", "Room Heater"],
      facilities: ["Restaurant", "Trekking Guide", "Bonfire", "Indoor Games", "Waterfall Tours", "Cave Exploration", "Parking"],
      accessibility: ["Ground Floor Rooms"]
    },
    policies: {
      checkInTime: "13:00",
      checkOutTime: "11:00",
      cancellationPolicy: {
        moreThan7Days: 100,
        between3To7Days: 60,
        lessThan3Days: 30,
        lessThan1Day: 0
      },
      houseRules: [
        "Trekking guide mandatory for certain trails",
        "Warm clothing recommended (nights are cold)",
        "Bonfire on request (weather permitting)",
        "Adventure activities subject to weather"
      ]
    },
    pricing: {
      seasonalRates: [
        {
          name: "Peak Season",
          startDate: new Date('2026-10-01'),
          endDate: new Date('2027-03-31'),
          multiplier: 1.5
        },
        {
          name: "Summer Special",
          startDate: new Date('2026-04-01'),
          endDate: new Date('2026-06-30'),
          multiplier: 1.3
        }
      ],
      weekendMultiplier: 1.2,
      gstRate: 12
    },
    ratings: {
      overall: 4.6,
      cleanliness: 4.7,
      amenities: 4.5,
      location: 4.9,
      service: 4.6,
      value: 4.6,
      totalReviews: 134
    },
    approvalStatus: "approved",
    isFeatured: true,
    isVerified: true
  }
];

// Function to seed properties
async function seedProperties() {
  try {
    console.log('🌱 Starting property seeding...\n');

    // Clear existing properties
    console.log('🗑️  Clearing existing properties...');
    await Property.deleteMany({});
    await Availability.deleteMany({});
    console.log('✅ Existing properties cleared\n');

    // Insert demo properties
    console.log('📝 Creating demo properties...');
    const createdProperties = await Property.insertMany(demoProperties);
    console.log(`✅ Created ${createdProperties.length} properties\n`);

    // Initialize availability for each property (365 days from today)
    console.log('📅 Initializing availability calendars...');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const property of createdProperties) {
      const availabilityDocs = [];

      // Create 365 days of availability
      for (let i = 0; i < 365; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);

        // Calculate total rooms
        const totalRooms = property.rooms.reduce((sum, room) => sum + room.count, 0);

        availabilityDocs.push({
          property: property._id,
          date: date,
          totalRooms: totalRooms,
          availableRooms: totalRooms,
          bookedRooms: 0,
          locks: []
        });
      }

      await Availability.insertMany(availabilityDocs);
      console.log(`✅ Initialized availability for: ${property.name}`);
    }

    console.log('\n🎉 Property seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   • Total Properties: ${createdProperties.length}`);
    console.log(`   • Heritage Properties: ${createdProperties.filter(p => p.type === 'heritage-property').length}`);
    console.log(`   • Hotels: ${createdProperties.filter(p => p.type === 'hotel').length}`);
    console.log(`   • Resorts: ${createdProperties.filter(p => p.type === 'resort').length}`);
    console.log(`   • Homestays: ${createdProperties.filter(p => p.type === 'homestay').length}`);
    console.log(`   • Eco Lodges: ${createdProperties.filter(p => p.type === 'eco-lodge').length}`);
    console.log(`   • Featured Properties: ${createdProperties.filter(p => p.isFeatured).length}`);
    console.log('\n✨ You can now test the booking system!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding properties:', error);
    process.exit(1);
  }
}

// Run the seeding
seedProperties();
