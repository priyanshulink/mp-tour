const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Optional auth - doesn't fail if no token, just sets req.user if valid token exists
exports.optionalAuth = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Get user from token
        req.user = await User.findById(decoded.id).select('-password');
      } catch (error) {
        // Token invalid, but don't block the request
        console.log('Invalid token in optional auth:', error.message);
      }
    }
    
    next();
  } catch (error) {
    // Don't block request, just continue without user
    next();
  }
};

// Protect routes - verify JWT token
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Please login.'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from token
    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. Invalid token.'
    });
  }
};

// Check if user is admin
exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin only route.'
    });
  }
};

// Check if user is authenticated (User or Admin)
exports.isUser = (req, res, next) => {
  if (req.user && (req.user.role === 'User' || req.user.role === 'Admin')) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied. User authentication required.'
    });
  }
};

// Authorize specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    // Convert role to lowercase for comparison
    const userRole = req.user.role ? req.user.role.toLowerCase() : '';
    const allowedRoles = roles.map(role => role.toLowerCase());

    if (!allowedRoles.includes(userRole) && userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`
      });
    }

    next();
  };
};
