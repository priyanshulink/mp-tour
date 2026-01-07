const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Event description is required']
  },
  monastery: {
    type: String,
    required: [true, 'Monastery name is required']
  },
  location: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: [true, 'Event date is required']
  },
  endDate: {
    type: Date
  },
  type: {
    type: String,
    enum: ['Festival', 'Ceremony', 'Prayer', 'Cultural', 'Tribal', 'Other'],
    default: 'Festival'
  },
  image: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for faster queries
eventSchema.index({ date: 1, monastery: 1 });

module.exports = mongoose.model('Event', eventSchema);
