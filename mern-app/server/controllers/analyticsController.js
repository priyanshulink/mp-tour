const User = require('../models/User');
const Story = require('../models/Story');
const Event = require('../models/Event');
const Itinerary = require('../models/Itinerary');

// @desc    Get admin dashboard analytics
// @route   GET /api/analytics/dashboard
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
  try {
    // Get counts
    const totalUsers = await User.countDocuments({ role: 'User' });
    const totalAdmins = await User.countDocuments({ role: 'Admin' });
    const totalStories = await Story.countDocuments();
    const pendingStories = await Story.countDocuments({ status: 'pending' });
    const approvedStories = await Story.countDocuments({ status: 'approved' });
    const rejectedStories = await Story.countDocuments({ status: 'rejected' });
    const totalEvents = await Event.countDocuments();
    const upcomingEvents = await Event.countDocuments({ 
      date: { $gte: new Date() },
      isActive: true 
    });
    const totalItineraries = await Itinerary.countDocuments();

    // Get recent activities
    const recentStories = await Story.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('author', 'name email');

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('-password');

    res.status(200).json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          admins: totalAdmins
        },
        stories: {
          total: totalStories,
          pending: pendingStories,
          approved: approvedStories,
          rejected: rejectedStories
        },
        events: {
          total: totalEvents,
          upcoming: upcomingEvents
        },
        itineraries: totalItineraries
      },
      recentActivities: {
        stories: recentStories,
        users: recentUsers
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user dashboard stats
// @route   GET /api/analytics/user-stats
// @access  Private
exports.getUserStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    const myStories = await Story.countDocuments({ author: req.user.id });
    const approvedStories = await Story.countDocuments({ 
      author: req.user.id, 
      status: 'approved' 
    });
    const pendingStories = await Story.countDocuments({ 
      author: req.user.id, 
      status: 'pending' 
    });
    const myItineraries = await Itinerary.countDocuments({ userId: req.user.id });

    res.status(200).json({
      success: true,
      stats: {
        contributions: user.contributions,
        stories: {
          total: myStories,
          approved: approvedStories,
          pending: pendingStories
        },
        itineraries: myItineraries
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
