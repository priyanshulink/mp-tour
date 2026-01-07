import axios from 'axios';

const API_URL = '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  getAllUsers: () => api.get('/auth/users'),
  deleteUser: (userId) => api.delete(`/auth/users/${userId}`)
};

// Event APIs
export const eventAPI = {
  getAllEvents: (params) => api.get('/events', { params }),
  getEvent: (id) => api.get(`/events/${id}`),
  createEvent: (formData) => api.post('/events', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateEvent: (id, formData) => api.put(`/events/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteEvent: (id) => api.delete(`/events/${id}`)
};

// Story APIs
export const storyAPI = {
  getAllStories: (params) => api.get('/stories', { params }),
  getMyStories: () => api.get('/stories/my-stories'),
  createStory: (formData) => api.post('/stories', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  moderateStory: (id, data) => api.put(`/stories/${id}/moderate`, data),
  deleteStory: (id) => api.delete(`/stories/${id}`),
  incrementViews: (id) => api.put(`/stories/${id}/view`)
};

// Itinerary APIs
export const itineraryAPI = {
  generateItinerary: (data) => api.post('/itinerary/generate', data),
  searchItineraries: (params) => api.get('/itinerary/search', { params }),
  getMyItineraries: () => api.get('/itinerary/my-itineraries'),
  getItinerary: (id) => api.get(`/itinerary/${id}`),
  deleteItinerary: (id) => api.delete(`/itinerary/${id}`)
};

// Chatbot APIs
export const chatbotAPI = {
  chat: (data) => api.post('/chatbot/chat', data),
  analyzeImage: (formData) => api.post('/chatbot/analyze-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
};

// Analytics APIs
export const analyticsAPI = {
  getDashboardStats: () => api.get('/analytics/dashboard'),
  getUserStats: () => api.get('/analytics/user-stats')
};

export default api;
