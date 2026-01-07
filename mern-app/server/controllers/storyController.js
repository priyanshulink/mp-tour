const Story = require('../models/Story');
const User = require('../models/User');

// @desc    Get all stories
// @route   GET /api/stories
// @access  Public (approved only) / Admin (all statuses)
exports.getAllStories = async (req, res) => {
  try {
    const { status, monastery, type } = req.query;
    
    let query = {};
    
    // Check if user is authenticated and is admin
    const isAdmin = req.user && req.user.role === 'Admin';
    
    // If admin and status is provided, filter by status
    if (isAdmin && status) {
      query.status = status;
    } 
    // If not admin, only show approved stories
    else if (!isAdmin) {
      query.status = 'approved';
    }
    // If admin but no status provided, show all stories
    
    if (monastery) {
      query.monastery = monastery;
    }
    
    if (type) {
      query.type = type;
    }
    
    const stories = await Story.find(query)
      .populate('author', 'name email')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: stories.length,
      stories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user's own stories
// @route   GET /api/stories/my-stories
// @access  Private
exports.getMyStories = async (req, res) => {
  try {
    const stories = await Story.find({ author: req.user.id })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: stories.length,
      stories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create story
// @route   POST /api/stories
// @access  Private
exports.createStory = async (req, res) => {
  try {
    const storyData = {
      ...req.body,
      author: req.user.id,
      authorName: req.user.name
    };
    
    if (req.file) {
      storyData.mediaUrl = `/uploads/${req.file.filename}`;
    }
    
    const story = await Story.create(storyData);
    
    // Update user contributions
    const updateField = `contributions.${story.type === 'story' ? 'stories' : story.type === 'photo' ? 'photos' : 'videos'}`;
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { [updateField]: 1 }
    });
    
    res.status(201).json({
      success: true,
      message: 'Story submitted successfully and pending approval',
      story
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Moderate story (approve/reject)
// @route   PUT /api/stories/:id/moderate
// @access  Private/Admin
exports.moderateStory = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    
    const story = await Story.findById(req.params.id);
    
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }
    
    story.status = status;
    story.moderatedBy = req.user.id;
    story.moderatedAt = Date.now();
    
    if (status === 'rejected' && rejectionReason) {
      story.rejectionReason = rejectionReason;
    }
    
    await story.save();
    
    res.status(200).json({
      success: true,
      message: `Story ${status} successfully`,
      story
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete story
// @route   DELETE /api/stories/:id
// @access  Private
exports.deleteStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }
    
    // Check authorization (own story or admin)
    if (story.author.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this story'
      });
    }
    
    await story.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Story deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Increment story views
// @route   PUT /api/stories/:id/view
// @access  Public
exports.incrementViews = async (req, res) => {
  try {
    const story = await Story.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    
    res.status(200).json({
      success: true,
      views: story.views
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
