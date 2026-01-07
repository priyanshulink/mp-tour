const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const { protect, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Configure multer for memory storage (store files in RAM temporarily)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'));
    }
  }
});

// Python service URL (update if different)
const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:5001';

/**
 * @route   POST /api/preservation/compare
 * @desc    Compare two images using Python OpenCV service
 * @access  Admin only
 */
router.post(
  '/compare',
  protect,
  isAdmin,
  upload.fields([
    { name: 'baseline', maxCount: 1 },
    { name: 'comparison', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      // Validate files
      if (!req.files || !req.files.baseline || !req.files.comparison) {
        return res.status(400).json({
          success: false,
          message: 'Both baseline and comparison images are required'
        });
      }

      const baselineFile = req.files.baseline[0];
      const comparisonFile = req.files.comparison[0];
      const { monasteryName, location } = req.body;

      console.log('Received comparison request:', {
        baseline: baselineFile.originalname,
        comparison: comparisonFile.originalname,
        monasteryName,
        location
      });

      // Create form data for Python service
      const formData = new FormData();
      formData.append('baseline_image', baselineFile.buffer, {
        filename: baselineFile.originalname,
        contentType: baselineFile.mimetype
      });
      formData.append('current_image', comparisonFile.buffer, {
        filename: comparisonFile.originalname,
        contentType: comparisonFile.mimetype
      });
      
      if (location) formData.append('location', location);
      if (monasteryName) formData.append('structure_component', monasteryName);

      // Call Python service for image comparison
      console.log('Sending request to Python service...');
      const pythonResponse = await axios.post(
        `${PYTHON_SERVICE_URL}/api/compare`,
        formData,
        {
          headers: {
            ...formData.getHeaders()
          },
          timeout: 60000 // 60 second timeout
        }
      );

      const analysisResults = pythonResponse.data;
      console.log('Received analysis results:', {
        ssim: analysisResults.ssim_score,
        severity: analysisResults.severity,
        contours: analysisResults.contour_count
      });

      // Generate affected areas from contours
      const affectedAreas = generateAffectedAreas(
        analysisResults.contour_count,
        analysisResults.severity,
        analysisResults.affected_area
      );

      // Generate recommendations based on severity
      const recommendations = generateRecommendations(
        analysisResults.severity,
        analysisResults.difference_percentage,
        monasteryName || 'monastery'
      );

      // Prepare response with detailed analysis
      const response = {
        success: true,
        analysis: {
          ssimScore: analysisResults.ssim_score,
          similarityPercentage: (analysisResults.ssim_score * 100).toFixed(2),
          changesDetected: analysisResults.contour_count,
          deteriorationLevel: analysisResults.severity,
          differencePercentage: analysisResults.difference_percentage.toFixed(2),
          affectedAreaPercentage: analysisResults.affected_area.toFixed(2),
          affectedAreas: affectedAreas,
          recommendations: recommendations,
          differenceImage: analysisResults.difference_image,
          changeDetected: analysisResults.change_detected,
          message: analysisResults.message,
          metadata: {
            monasteryName: monasteryName || 'Unknown',
            location: location || 'Not specified',
            analysisDate: new Date().toISOString(),
            baselineImage: baselineFile.originalname,
            comparisonImage: comparisonFile.originalname
          }
        }
      };

      res.json(response);

    } catch (error) {
      console.error('Preservation comparison error:', error.message);
      
      // Check if Python service is unavailable
      if (error.code === 'ECONNREFUSED') {
        return res.status(503).json({
          success: false,
          message: 'Python analysis service is unavailable. Please ensure it is running on port 5001.',
          error: 'SERVICE_UNAVAILABLE'
        });
      }

      // Check for timeout
      if (error.code === 'ECONNABORTED') {
        return res.status(504).json({
          success: false,
          message: 'Image analysis timed out. Images may be too large.',
          error: 'TIMEOUT'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to perform image comparison',
        error: error.message
      });
    }
  }
);

/**
 * @route   GET /api/preservation/health
 * @desc    Check if Python service is running
 * @access  Admin only
 */
router.get('/health', protect, isAdmin, async (req, res) => {
  try {
    const pythonHealth = await axios.get(`${PYTHON_SERVICE_URL}/health`, {
      timeout: 5000
    });

    res.json({
      success: true,
      backend: 'online',
      pythonService: 'online',
      pythonData: pythonHealth.data
    });
  } catch (error) {
    res.json({
      success: false,
      backend: 'online',
      pythonService: 'offline',
      message: 'Python service is not responding. Please start it on port 5001.'
    });
  }
});

/**
 * Helper function to generate affected areas based on analysis
 */
function generateAffectedAreas(contourCount, severity, affectedPercentage) {
  const areas = [];
  
  if (contourCount === 0 || severity === 'EXCELLENT' || severity === 'NO_CHANGE') {
    return ['No significant structural changes detected'];
  }

  // Generate descriptive area names based on contour count
  const possibleAreas = [
    'North Wall Section',
    'South Wall Section',
    'East Facade',
    'West Facade',
    'Roof Section',
    'Main Entrance',
    'Prayer Hall',
    'Monastery Courtyard',
    'Bell Tower',
    'Meditation Chamber',
    'Foundation Base',
    'Window Frames'
  ];

  // Select areas based on number of contours
  const numAreas = Math.min(contourCount, Math.max(3, Math.floor(contourCount / 2)));
  
  for (let i = 0; i < numAreas && i < possibleAreas.length; i++) {
    areas.push(possibleAreas[i]);
  }

  return areas;
}

/**
 * Helper function to generate recommendations based on severity
 */
function generateRecommendations(severity, differencePercentage, monasteryName) {
  const recommendations = [];

  switch (severity) {
    case 'CRITICAL':
      recommendations.push(`🚨 URGENT: Immediate on-site inspection required for ${monasteryName}`);
      recommendations.push('Schedule emergency structural assessment with certified engineer');
      recommendations.push('Document all damage with detailed photography');
      recommendations.push('Implement temporary protective measures to prevent further deterioration');
      recommendations.push('Contact heritage conservation authorities immediately');
      break;

    case 'POOR':
      recommendations.push(`⚠️ HIGH PRIORITY: Significant structural changes detected at ${monasteryName}`);
      recommendations.push('Schedule comprehensive structural inspection within 2 weeks');
      recommendations.push('Begin documentation process for restoration planning');
      recommendations.push('Monitor weather exposure and implement protective measures');
      recommendations.push('Allocate emergency preservation budget');
      break;

    case 'MODERATE':
      recommendations.push(`📋 ATTENTION: Notable deterioration observed at ${monasteryName}`);
      recommendations.push('Schedule routine maintenance inspection within 1 month');
      recommendations.push('Monitor identified areas for progressive deterioration');
      recommendations.push('Plan preventive conservation measures');
      recommendations.push('Document changes for historical records');
      break;

    case 'GOOD':
      recommendations.push(`✓ ROUTINE: Minor changes detected at ${monasteryName}`);
      recommendations.push('Continue regular monitoring schedule (quarterly assessments)');
      recommendations.push('Maintain current preservation efforts');
      recommendations.push('Document for baseline comparison');
      break;

    case 'EXCELLENT':
    case 'NO_CHANGE':
      recommendations.push(`✓ STABLE: Excellent preservation condition at ${monasteryName}`);
      recommendations.push('Continue current maintenance protocols');
      recommendations.push('Conduct annual monitoring assessments');
      recommendations.push('Maintain photographic documentation');
      break;

    default:
      recommendations.push('Schedule inspection to assess structural condition');
      recommendations.push('Maintain regular monitoring schedule');
  }

  return recommendations;
}

module.exports = router;
