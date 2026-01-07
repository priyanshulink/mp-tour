const mongoose = require('mongoose');

const itinerarySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  itinerary_id: {
    type: Number,
    unique: true,
    sparse: true
  },
  travel_experience: {
    type: String,
    enum: ['Cultural', 'Adventure', 'Spiritual', 'Photography', 'Nature', 'Heritage'],
    default: 'Cultural'
  },
  days: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  budget_category: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Luxury'],
    default: 'Medium'
  },
  season: {
    type: String,
    enum: ['Spring', 'Summer', 'Monsoon', 'Autumn', 'Winter'],
    required: true
  },
  weather_condition: {
    type: String,
    enum: ['Sunny', 'Rainy', 'Cloudy', 'Snowy', 'Clear'],
    default: 'Clear'
  },
  destination: {
    type: String,
    required: true
  },
  monastery_name: {
    type: String,
    required: true
  },
  activity_type: {
    type: String,
    default: 'Monastery visit & cultural exploration'
  },
  daily_plan: {
    type: String,
    required: true
  },
  estimated_daily_cost_inr: {
    type: Number,
    default: 2000
  },
  recommended_transport: {
    type: String,
    enum: ['Bus', 'Taxi', 'Private Car', 'Shared Jeep', 'Bike'],
    default: 'Taxi'
  },
  stay_type: {
    type: String,
    enum: ['Homestay', 'Hotel', 'Guesthouse', 'Resort', 'Budget Hotel'],
    default: 'Hotel'
  },
  food_preference: {
    type: String,
    enum: ['Veg', 'Non-Veg', 'Both', 'Vegan'],
    default: 'Both'
  },
  notes: {
    type: String
  },
  // Legacy fields for backward compatibility
  title: {
    type: String,
    trim: true
  },
  monasteries: [{
    name: String,
    location: String,
    day: Number,
    nearestTown: String,
    experiences: [String]
  }],
  startDate: {
    type: Date
  },
  isPublic: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Itinerary', itinerarySchema);
