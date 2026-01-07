const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
  chat,
  analyzeImage
} = require('../controllers/chatbotController');

// Public routes
router.post('/chat', chat);
router.post('/analyze-image', upload.single('image'), analyzeImage);

module.exports = router;
