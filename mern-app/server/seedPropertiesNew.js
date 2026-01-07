const mongoose = require('mongoose');
const Property = require('./models/Property');
const Availability = require('./models/Availability');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/monastery-heritage')
  .then(() => console.log('✅ MongoDB connected for seeding'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Helper function to generate property ID
function generatePropertyId(index) {
  return `MPT2026${String(index).padStart(3, '0')}`;
}

// Demo properties data matching the actual schema
const demoProperties = [
  {
    propertyId: generatePropertyId(1),
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
      { url: "/img/properties/royal_heritage_palace.png", caption: "Palace Exterior", isPrimary: true },
      { url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800", caption: "Royal Courtyard", isPrimary: false },
      { url: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800", caption: "Heritage Room", isPrimary: false }
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
      basic: ["WiFi", "Air Conditioning", "Room Service"],
      dining: ["Restaurant", "Room Service"],
      activities: ["Heritage Museum", "Palace Tour", "Cultural Programs"],
      services: ["Daily Housekeeping", "Laundry", "Butler Service"]
    },
    pricing: {
      basePrice: 6500,
      seasonalRates: [
        {
          season: "peak",
          multiplier: 1.4,
          startDate: new Date('2026-10-01'),
          endDate: new Date('2027-03-31')
        }
      ],
      weekendMultiplier: 1.2,
      taxes: {
        gst: 18,
        tourismFee: 0
      }
    },
    policies: {
      checkIn: "14:00",
      checkOut: "11:00",
      cancellation: {
        fullRefund: 7,
        partialRefund: 3,
        refundPercentage: 50,
        noRefund: 1
      },
      rules: ["No smoking inside palace rooms", "Respectful behavior in heritage areas", "Photography allowed in designated areas"],
      minStay: 1,
      maxStay: 30
    },
    availability: {
      isActive: true,
      blockedDates: []
    },
    owner: {
      name: "Heritage Tourism Board",
      contact: "+91-9876543210",
      email: "heritage@mptourism.com"
    },
    approval: {
      status: "approved",
      verifiedAt: new Date(),
      remarks: "Verified heritage property"
    },
    ratings: {
      average: 4.8,
      count: 127,
      distribution: { 5: 85, 4: 30, 3: 8, 2: 3, 1: 1 }
    },
    featured: true,
    verified: true,
    tags: ["Heritage", "Luxury", "Cultural", "Palace"]
  },
  {
    propertyId: generatePropertyId(2),
    name: "Lakeside Eco Resort",
    type: "eco-lodge",
    category: "standard",
    description: {
      short: "Sustainable eco-resort by serene Bhojtal Lake with solar-powered cottages, organic farm, and nature trails.",
      detailed: "Sustainable eco-resort nestled by the serene Bhojtal Lake. Solar-powered cottages, organic farm, and nature trails offer a perfect eco-tourism experience. Enjoy kayaking, bird watching, and organic meals while staying in harmony with nature."
    },
    location: {
      address: "VIP Road, Bhojtal Lake Area",
      city: "Bhopal",
      district: "Bhopal",
      state: "Madhya Pradesh",
      pincode: "462026",
      tourismCircuit: "Vindhya",
      coordinates: {
        latitude: 23.2599,
        longitude: 77.4126
      }
    },
    images: [
      { url: "/img/properties/lakeside_eco_resort.png", caption: "Lake View", isPrimary: true },
      { url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800", caption: "Eco Cottage", isPrimary: false },
      { url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800", caption: "Nature Trail", isPrimary: false }
    ],
    rooms: [
      {
        roomType: "Eco Cottage",
        basePrice: 3200,
        capacity: 3,
        totalRooms: 10,
        amenities: ["Solar Power", "Lake View", "Natural Ventilation", "Organic Toiletries"]
      },
      {
        roomType: "Family Eco Villa",
        basePrice: 5500,
        capacity: 5,
        totalRooms: 5,
        amenities: ["Two Bedrooms", "Solar Power", "Kitchen", "Garden Access"]
      }
    ],
    totalCapacity: 55,
    amenities: {
      basic: ["Eco-friendly Toiletries", "Natural Cooling"],
      dining: ["Organic Restaurant"],
      activities: ["Nature Trails", "Kayaking", "Bird Watching", "Organic Farm Tour", "Yoga"],
      services: ["Daily Housekeeping"]
    },
    pricing: {
      basePrice: 3800,
      seasonalRates: [
        {
          season: "peak",
          multiplier: 1.3,
          startDate: new Date('2026-10-01'),
          endDate: new Date('2027-03-31')
        }
      ],
      weekendMultiplier: 1.15,
      taxes: {
        gst: 12,
        tourismFee: 0
      }
    },
    policies: {
      checkIn: "14:00",
      checkOut: "11:00",
      cancellation: {
        fullRefund: 7,
        partialRefund: 3,
        refundPercentage: 60,
        noRefund: 1
      },
      rules: ["No plastic bottles or bags", "Respect wildlife and nature", "Use eco-friendly products only"],
      minStay: 1,
      maxStay: 15
    },
    availability: {
      isActive: true,
      blockedDates: []
    },
    owner: {
      name: "Eco Tourism Society",
      contact: "+91-9876543211",
      email: "eco@mptourism.com"
    },
    approval: {
      status: "approved",
      verifiedAt: new Date(),
      remarks: "Certified eco-friendly property"
    },
    ratings: {
      average: 4.6,
      count: 89,
      distribution: { 5: 55, 4: 25, 3: 7, 2: 2, 1: 0 }
    },
    featured: true,
    verified: true,
    tags: ["Eco-Friendly", "Nature", "Sustainable", "Lake"]
  },
  {
    propertyId: generatePropertyId(3),
    name: "Narmada River Resort",
    type: "resort",
    category: "luxury",
    description: {
      short: "Luxury resort on banks of holy Narmada River with spa, adventure sports, and spiritual experiences.",
      detailed: "Luxury resort on the banks of holy Narmada River. Offers premium accommodation, spa, adventure sports, and spiritual experiences. Perfect for families and adventure enthusiasts with river rafting, marble rocks tour, and wellness facilities."
    },
    location: {
      address: "River Front, Narmada Road",
      city: "Jabalpur",
      district: "Jabalpur",
      state: "Madhya Pradesh",
      pincode: "482001",
      tourismCircuit: "Mahakaushal",
      coordinates: {
        latitude: 23.1815,
        longitude: 79.9864
      }
    },
    images: [
      { url: "/img/properties/narmada_river_resort.png", caption: "River View", isPrimary: true },
      { url: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800", caption: "Resort Pool", isPrimary: false },
      { url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800", caption: "Luxury Room", isPrimary: false }
    ],
    rooms: [
      {
        roomType: "River View Premium",
        basePrice: 6500,
        capacity: 2,
        totalRooms: 15,
        amenities: ["King Bed", "River View", "Balcony", "Mini Bar", "Smart TV"]
      },
      {
        roomType: "Family Suite",
        basePrice: 9500,
        capacity: 4,
        totalRooms: 8,
        amenities: ["Two Bedrooms", "Living Room", "River View", "Dining Area", "Kitchenette"]
      },
      {
        roomType: "Deluxe Room",
        basePrice: 4500,
        capacity: 2,
        totalRooms: 20,
        amenities: ["Queen Bed", "Garden View", "Smart TV", "Work Desk"]
      }
    ],
    totalCapacity: 102,
    amenities: {
      basic: ["WiFi", "Air Conditioning", "Room Service", "Welcome Drink"],
      dining: ["Multi-Cuisine Restaurant", "Room Service"],
      activities: ["Swimming Pool", "River Rafting", "Marble Rocks Tour"],
      services: ["Spa & Wellness", "Gym", "Daily Housekeeping", "Laundry"]
    },
    pricing: {
      basePrice: 6200,
      seasonalRates: [
        {
          season: "peak",
          multiplier: 1.5,
          startDate: new Date('2026-10-01'),
          endDate: new Date('2027-03-31')
        }
      ],
      weekendMultiplier: 1.25,
      taxes: {
        gst: 18,
        tourismFee: 0
      }
    },
    policies: {
      checkIn: "14:00",
      checkOut: "12:00",
      cancellation: {
        fullRefund: 7,
        partialRefund: 3,
        refundPercentage: 50,
        noRefund: 1
      },
      rules: ["Pool access: 6 AM - 8 PM", "Spa reservations required", "Adventure activities subject to weather"],
      minStay: 1,
      maxStay: 30
    },
    availability: {
      isActive: true,
      blockedDates: []
    },
    owner: {
      name: "River Resorts Pvt Ltd",
      contact: "+91-9876543212",
      email: "narmada@mptourism.com"
    },
    approval: {
      status: "approved",
      verifiedAt: new Date(),
      remarks: "Premium resort facility"
    },
    ratings: {
      average: 4.7,
      count: 203,
      distribution: { 5: 130, 4: 55, 3: 15, 2: 2, 1: 1 }
    },
    featured: true,
    verified: true,
    tags: ["Luxury", "Adventure", "Family", "River"]
  },
  {
    propertyId: generatePropertyId(4),
    name: "Temple View Homestay",
    type: "homestay",
    category: "budget",
    description: {
      short: "Cozy homestay with stunning views of Mahakaleshwar Temple, offering authentic Ujjain culture and home-cooked meals.",
      detailed: "Cozy homestay with stunning views of Mahakaleshwar Temple. Experience authentic Ujjain culture with home-cooked meals and warm hospitality. Perfect for spiritual travelers with early morning temple visits arranged."
    },
    location: {
      address: "Near Mahakaleshwar Temple, Old City",
      city: "Ujjain",
      district: "Ujjain",
      state: "Madhya Pradesh",
      pincode: "456001",
      tourismCircuit: "Malwa",
      coordinates: {
        latitude: 23.1765,
        longitude: 75.7683
      }
    },
    images: [
      { url: "/img/properties/temple_view_homestay.png", caption: "Homestay Exterior", isPrimary: true },
      { url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800", caption: "Cozy Room", isPrimary: false },
      { url: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800", caption: "Temple View", isPrimary: false }
    ],
    rooms: [
      {
        roomType: "Deluxe Room",
        basePrice: 1500,
        capacity: 2,
        totalRooms: 4,
        amenities: ["Double Bed", "Temple View", "Fan", "Attached Bathroom"]
      },
      {
        roomType: "Family Room",
        basePrice: 2200,
        capacity: 4,
        totalRooms: 2,
        amenities: ["Two Beds", "Extra Mattress", "Fan", "Attached Bathroom"]
      }
    ],
    totalCapacity: 16,
    amenities: {
      basic: ["WiFi", "Hot Water"],
      dining: ["Home Cooked Meals", "Traditional Cuisine"],
      activities: ["Temple Tour Guide", "Local Cuisine Classes"],
      services: ["Laundry Service", "Daily Housekeeping"]
    },
    pricing: {
      basePrice: 1700,
      seasonalRates: [
        {
          season: "festival",
          multiplier: 1.8,
          startDate: new Date('2026-02-15'),
          endDate: new Date('2026-03-15')
        }
      ],
      weekendMultiplier: 1.1,
      taxes: {
        gst: 12,
        tourismFee: 0
      }
    },
    policies: {
      checkIn: "12:00",
      checkOut: "11:00",
      cancellation: {
        fullRefund: 7,
        partialRefund: 3,
        refundPercentage: 70,
        noRefund: 1
      },
      rules: ["Respect prayer times and silence hours", "No alcohol or non-vegetarian food", "Temple etiquette to be followed"],
      minStay: 1,
      maxStay: 10
    },
    availability: {
      isActive: true,
      blockedDates: []
    },
    owner: {
      name: "Sharma Family",
      contact: "+91-9876543213",
      email: "temple@homestay.com"
    },
    approval: {
      status: "approved",
      verifiedAt: new Date(),
      remarks: "Verified homestay near temple"
    },
    ratings: {
      average: 4.5,
      count: 56,
      distribution: { 5: 35, 4: 15, 3: 5, 2: 1, 1: 0 }
    },
    featured: false,
    verified: true,
    tags: ["Homestay", "Spiritual", "Budget", "Temple"]
  },
  {
    propertyId: generatePropertyId(5),
    name: "Business Hub Hotel",
    type: "hotel",
    category: "standard",
    description: {
      short: "Modern business hotel in heart of Indore with conference facilities, high-speed internet, and airport connectivity.",
      detailed: "Modern business hotel in the heart of Indore. Perfect for business travelers with conference facilities, high-speed internet, and airport connectivity. Features comfortable rooms, business center, and multi-cuisine restaurant."
    },
    location: {
      address: "MG Road, Business District",
      city: "Indore",
      district: "Indore",
      state: "Madhya Pradesh",
      pincode: "452001",
      tourismCircuit: "Malwa",
      coordinates: {
        latitude: 22.7196,
        longitude: 75.8577
      }
    },
    images: [
      { url: "/img/properties/business_hub_hotel.png", caption: "Hotel Exterior", isPrimary: true },
      { url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800", caption: "Executive Room", isPrimary: false },
      { url: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800", caption: "Conference Room", isPrimary: false }
    ],
    rooms: [
      {
        roomType: "Executive Room",
        basePrice: 3200,
        capacity: 2,
        totalRooms: 25,
        amenities: ["King Bed", "Work Desk", "High-speed WiFi", "Smart TV", "Mini Bar"]
      },
      {
        roomType: "Standard Room",
        basePrice: 2400,
        capacity: 2,
        totalRooms: 30,
        amenities: ["Queen Bed", "WiFi", "TV", "Work Desk", "Coffee Maker"]
      },
      {
        roomType: "Business Suite",
        basePrice: 5500,
        capacity: 2,
        totalRooms: 10,
        amenities: ["King Bed", "Living Room", "Office Space", "Smart TV", "Mini Bar"]
      }
    ],
    totalCapacity: 130,
    amenities: {
      basic: ["WiFi", "Air Conditioning", "24x7 Room Service", "Newspaper"],
      dining: ["Restaurant", "Cafe", "Room Service"],
      activities: [],
      services: ["Business Center", "Conference Rooms", "Gym", "Airport Shuttle", "Laundry"]
    },
    pricing: {
      basePrice: 3200,
      seasonalRates: [],
      weekendMultiplier: 1.1,
      taxes: {
        gst: 12,
        tourismFee: 0
      }
    },
    policies: {
      checkIn: "14:00",
      checkOut: "12:00",
      cancellation: {
        fullRefund: 7,
        partialRefund: 3,
        refundPercentage: 50,
        noRefund: 1
      },
      rules: ["24x7 check-in available", "Conference rooms require advance booking", "Airport shuttle on request"],
      minStay: 1,
      maxStay: 30
    },
    availability: {
      isActive: true,
      blockedDates: []
    },
    owner: {
      name: "Business Hotels Pvt Ltd",
      contact: "+91-9876543214",
      email: "business@mptourism.com"
    },
    approval: {
      status: "approved",
      verifiedAt: new Date(),
      remarks: "Verified business hotel"
    },
    ratings: {
      average: 4.3,
      count: 178,
      distribution: { 5: 80, 4: 70, 3: 20, 2: 6, 1: 2 }
    },
    featured: false,
    verified: true,
    tags: ["Business", "Conference", "Airport", "City Center"]
  },
  {
    propertyId: generatePropertyId(6),
    name: "Khajuraho Heritage Resort",
    type: "resort",
    category: "luxury",
    description: {
      short: "Luxury resort near world-famous Khajuraho temples with temple-inspired architecture and cultural performances.",
      detailed: "Luxury resort near the world-famous Khajuraho temples. Featuring temple-inspired architecture, cultural performances, and premium amenities. Perfect for cultural tourism with daily dance shows and temple tours."
    },
    location: {
      address: "Temple Circuit Road, Near Western Group",
      city: "Khajuraho",
      district: "Chhatarpur",
      state: "Madhya Pradesh",
      pincode: "471606",
      tourismCircuit: "Bundelkhand",
      coordinates: {
        latitude: 24.8318,
        longitude: 79.9199
      }
    },
    images: [
      { url: "/img/properties/khajuraho_heritage_resort.png", caption: "Resort Exterior", isPrimary: true },
      { url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800", caption: "Heritage Suite", isPrimary: false },
      { url: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800", caption: "Cultural Show", isPrimary: false }
    ],
    rooms: [
      {
        roomType: "Heritage Suite",
        basePrice: 7500,
        capacity: 2,
        totalRooms: 12,
        amenities: ["King Bed", "Temple View", "Private Balcony", "Jacuzzi", "Mini Bar"]
      },
      {
        roomType: "Deluxe Room",
        basePrice: 5000,
        capacity: 2,
        totalRooms: 20,
        amenities: ["Queen Bed", "Garden View", "Smart TV", "Mini Bar", "Bathtub"]
      },
      {
        roomType: "Garden Villa",
        basePrice: 10000,
        capacity: 4,
        totalRooms: 6,
        amenities: ["Two Bedrooms", "Private Garden", "Living Room", "Kitchen", "BBQ Area"]
      }
    ],
    totalCapacity: 88,
    amenities: {
      basic: ["WiFi", "Air Conditioning", "Room Service", "Welcome Amenities"],
      dining: ["Multi-Cuisine Restaurant", "Room Service"],
      activities: ["Swimming Pool", "Cultural Dance Shows", "Temple Tour", "Yoga Sessions"],
      services: ["Spa", "Gym", "Daily Housekeeping", "Laundry"]
    },
    pricing: {
      basePrice: 6800,
      seasonalRates: [
        {
          season: "peak",
          multiplier: 1.6,
          startDate: new Date('2026-10-01'),
          endDate: new Date('2027-03-31')
        },
        {
          season: "festival",
          multiplier: 2.0,
          startDate: new Date('2027-02-20'),
          endDate: new Date('2027-03-01')
        }
      ],
      weekendMultiplier: 1.2,
      taxes: {
        gst: 18,
        tourismFee: 0
      }
    },
    policies: {
      checkIn: "14:00",
      checkOut: "12:00",
      cancellation: {
        fullRefund: 7,
        partialRefund: 3,
        refundPercentage: 50,
        noRefund: 1
      },
      rules: ["Cultural dance shows at 7 PM daily", "Temple visits arranged", "Yoga sessions at sunrise"],
      minStay: 1,
      maxStay: 30
    },
    availability: {
      isActive: true,
      blockedDates: []
    },
    owner: {
      name: "Heritage Resorts Ltd",
      contact: "+91-9876543215",
      email: "khajuraho@mptourism.com"
    },
    approval: {
      status: "approved",
      verifiedAt: new Date(),
      remarks: "Premium cultural resort"
    },
    ratings: {
      average: 4.9,
      count: 245,
      distribution: { 5: 200, 4: 35, 3: 8, 2: 2, 1: 0 }
    },
    featured: true,
    verified: true,
    tags: ["Heritage", "Cultural", "Luxury", "Temple"]
  },
  {
    propertyId: generatePropertyId(7),
    name: "Countryside Farm Stay",
    type: "homestay",
    category: "budget",
    description: {
      short: "Authentic farm stay in rural MP with farming activities, organic meals, and traditional village life experience.",
      detailed: "Authentic farm stay experience in rural Madhya Pradesh. Participate in farming activities, enjoy organic meals, and experience village life. Perfect for families looking for rural tourism near Sanchi Stupa."
    },
    location: {
      address: "Village Khermai, Near Sanchi Stupa",
      city: "Raisen",
      district: "Raisen",
      state: "Madhya Pradesh",
      pincode: "464551",
      tourismCircuit: "Vindhya",
      coordinates: {
        latitude: 23.4799,
        longitude: 77.7394
      }
    },
    images: [
      { url: "/img/properties/countryside_farm_stay.png", caption: "Farm Stay", isPrimary: true },
      { url: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800", caption: "Farm Life", isPrimary: false },
      { url: "https://images.unsplash.com/photo-1542401886-65d6c61db217?w=800", caption: "Countryside", isPrimary: false }
    ],
    rooms: [
      {
        roomType: "Farm Cottage",
        basePrice: 1200,
        capacity: 2,
        totalRooms: 5,
        amenities: ["Double Bed", "Farm View", "Fan", "Attached Bathroom", "Mosquito Net"]
      },
      {
        roomType: "Family Cottage",
        basePrice: 1800,
        capacity: 4,
        totalRooms: 3,
        amenities: ["Two Beds", "Kitchen Access", "Farm View", "Sitting Area", "Outdoor Space"]
      }
    ],
    totalCapacity: 22,
    amenities: {
      basic: ["Hot Water"],
      dining: ["Organic Meals", "Traditional Cuisine"],
      activities: ["Farm Tour", "Bullock Cart Ride", "Village Walk", "Cooking Classes", "Bonfire"],
      services: ["Laundry", "Daily Housekeeping"]
    },
    pricing: {
      basePrice: 1400,
      seasonalRates: [
        {
          season: "peak",
          multiplier: 1.2,
          startDate: new Date('2026-11-01'),
          endDate: new Date('2026-12-31')
        }
      ],
      weekendMultiplier: 1.15,
      taxes: {
        gst: 0,
        tourismFee: 0
      }
    },
    policies: {
      checkIn: "12:00",
      checkOut: "11:00",
      cancellation: {
        fullRefund: 7,
        partialRefund: 3,
        refundPercentage: 75,
        noRefund: 1
      },
      rules: ["Participate in farm activities", "Respect farm animals and plants", "Vegetarian meals only"],
      minStay: 1,
      maxStay: 7
    },
    availability: {
      isActive: true,
      blockedDates: []
    },
    owner: {
      name: "Farmer's Collective",
      contact: "+91-9876543216",
      email: "farm@mptourism.com"
    },
    approval: {
      status: "approved",
      verifiedAt: new Date(),
      remarks: "Verified rural tourism property"
    },
    ratings: {
      average: 4.7,
      count: 42,
      distribution: { 5: 30, 4: 8, 3: 3, 2: 1, 1: 0 }
    },
    featured: false,
    verified: true,
    tags: ["Rural", "Farm", "Organic", "Budget"]
  },
  {
    propertyId: generatePropertyId(8),
    name: "Pachmarhi Hill Station Retreat",
    type: "resort",
    category: "standard",
    description: {
      short: "Scenic mountain resort in Pachmarhi hill station with valley views, waterfalls nearby, and adventure activities.",
      detailed: "Scenic mountain resort in Pachmarhi hill station. Perfect for nature lovers with valley views, waterfalls nearby, and adventure activities. Enjoy trekking, cave exploration, and mountain breeze in this beautiful hill station."
    },
    location: {
      address: "Valley View Road, Near Bee Fall",
      city: "Pachmarhi",
      district: "Hoshangabad",
      state: "Madhya Pradesh",
      pincode: "461881",
      tourismCircuit: "Nimar",
      coordinates: {
        latitude: 22.4676,
        longitude: 78.4322
      }
    },
    images: [
      { url: "/img/properties/pachmarhi_hill_retreat.png", caption: "Mountain View", isPrimary: true },
      { url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800", caption: "Nature Trail", isPrimary: false },
      { url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800", caption: "Valley View", isPrimary: false }
    ],
    rooms: [
      {
        roomType: "Valley View Room",
        basePrice: 3800,
        capacity: 2,
        totalRooms: 15,
        amenities: ["Queen Bed", "Valley View", "Balcony", "Heater", "Hot Water"]
      },
      {
        roomType: "Mountain Suite",
        basePrice: 5500,
        capacity: 3,
        totalRooms: 8,
        amenities: ["King Bed", "Living Room", "Mountain View", "Fireplace", "Mini Bar"]
      },
      {
        roomType: "Family Cottage",
        basePrice: 4800,
        capacity: 4,
        totalRooms: 10,
        amenities: ["Two Bedrooms", "Garden", "Kitchen", "BBQ Area", "Kids Play Area"]
      }
    ],
    totalCapacity: 94,
    amenities: {
      basic: ["WiFi", "Hot Water", "Room Service", "Room Heater"],
      dining: ["Restaurant", "Room Service"],
      activities: ["Trekking Guide", "Bonfire", "Waterfall Tours", "Cave Exploration"],
      services: ["Daily Housekeeping", "Laundry", "Parking"]
    },
    pricing: {
      basePrice: 4200,
      seasonalRates: [
        {
          season: "peak",
          multiplier: 1.5,
          startDate: new Date('2026-10-01'),
          endDate: new Date('2027-03-31')
        },
        {
          season: "offpeak",
          multiplier: 1.3,
          startDate: new Date('2026-04-01'),
          endDate: new Date('2026-06-30')
        }
      ],
      weekendMultiplier: 1.2,
      taxes: {
        gst: 12,
        tourismFee: 0
      }
    },
    policies: {
      checkIn: "13:00",
      checkOut: "11:00",
      cancellation: {
        fullRefund: 7,
        partialRefund: 3,
        refundPercentage: 60,
        noRefund: 1
      },
      rules: ["Trekking guide mandatory for certain trails", "Warm clothing recommended", "Bonfire on request"],
      minStay: 1,
      maxStay: 15
    },
    availability: {
      isActive: true,
      blockedDates: []
    },
    owner: {
      name: "Hill Station Resorts",
      contact: "+91-9876543217",
      email: "pachmarhi@mptourism.com"
    },
    approval: {
      status: "approved",
      verifiedAt: new Date(),
      remarks: "Verified hill station resort"
    },
    ratings: {
      average: 4.6,
      count: 134,
      distribution: { 5: 75, 4: 45, 3: 10, 2: 3, 1: 1 }
    },
    featured: true,
    verified: true,
    tags: ["Hill Station", "Adventure", "Nature", "Family"]
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

        // Calculate total capacity from all rooms
        const totalCapacity = property.rooms.reduce((sum, room) => sum + (room.totalRooms * room.capacity), 0);

        // Create room-wise availability
        const roomsAvailability = property.rooms.map(room => ({
          roomType: room.roomType,
          totalRooms: room.totalRooms,
          availableRooms: room.totalRooms,
          bookedRooms: 0,
          blockedRooms: 0,
          priceOverride: null
        }));

        availabilityDocs.push({
          propertyId: property._id,
          date: date,
          rooms: roomsAvailability,
          totalCapacity: totalCapacity,
          availableCapacity: totalCapacity,
          pricing: {
            basePrice: property.pricing.basePrice,
            seasonalMultiplier: 1,
            isWeekend: date.getDay() === 0 || date.getDay() === 6,
            isFestival: false,
            finalPrice: property.pricing.basePrice
          },
          locks: [],
          isBlocked: false
        });
      }

      await Availability.insertMany(availabilityDocs);
      console.log(`✅ Initialized availability for: ${property.name}`);
    }

    console.log('\n🎉 Property seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   • Total Properties: ${createdProperties.length}`);
    console.log(`   • Heritage Properties: ${createdProperties.filter(p => p.type === 'heritage').length}`);
    console.log(`   • Hotels: ${createdProperties.filter(p => p.type === 'hotel').length}`);
    console.log(`   • Resorts: ${createdProperties.filter(p => p.type === 'resort').length}`);
    console.log(`   • Homestays: ${createdProperties.filter(p => p.type === 'homestay').length}`);
    console.log(`   • Eco Lodges: ${createdProperties.filter(p => p.type === 'eco-lodge').length}`);
    console.log(`   • Featured Properties: ${createdProperties.filter(p => p.featured).length}`);
    console.log('\n✨ You can now test the booking system at http://localhost:5173/properties\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding properties:', error);
    process.exit(1);
  }
}

// Run the seeding
seedProperties();
