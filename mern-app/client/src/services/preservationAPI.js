import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with auth token
const getAuthConfig = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

/**
 * Compare two images using the preservation analysis system
 * @param {File} baselineFile - Baseline heritage site image
 * @param {File} comparisonFile - Current heritage site image for comparison
 * @param {Object} metadata - Additional metadata (siteName, location)
 * @returns {Promise} - Analysis results
 */
export const compareImages = async (baselineFile, comparisonFile, metadata = {}) => {
  try {
    const formData = new FormData();
    formData.append('baseline', baselineFile);
    formData.append('comparison', comparisonFile);
    
    if (metadata.monasteryName) {
      formData.append('monasteryName', metadata.monasteryName);
    }
    if (metadata.location) {
      formData.append('location', metadata.location);
    }

    const config = {
      ...getAuthConfig(),
      headers: {
        ...getAuthConfig().headers,
        'Content-Type': 'multipart/form-data'
      },
      timeout: 60000 // 60 second timeout for large images
    };

    const response = await axios.post(
      `${API_URL}/preservation/compare`,
      formData,
      config
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Comparison failed');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Images may be too large.');
    } else {
      throw new Error('Failed to connect to server');
    }
  }
};

/**
 * Check health status of preservation system
 * @returns {Promise} - Health status
 */
export const checkHealth = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/preservation/health`,
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    return {
      success: false,
      backend: 'unknown',
      pythonService: 'unknown',
      message: 'Failed to check health status'
    };
  }
};

const preservationAPI = {
  compareImages,
  checkHealth
};

export default preservationAPI;
