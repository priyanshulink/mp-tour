const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Story title is required'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Story content is required']
  },
  monastery: {
    type: String,
    required: [true, 'Monastery name is required']
  },
  type: {
    type: String,
    enum: ['story', 'photo', 'video'],
    required: true
  },
  mediaUrl: {
    type: String,
    default: ''
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  likes: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  moderatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  moderatedAt: {
    type: Date
  },
  rejectionReason: {
    type: String
  }
}, {
  timestamps: true
});

// Index for faster queries
storySchema.index({ status: 1, monastery: 1, createdAt: -1 });

module.exports = mongoose.model('Story', storySchema);
