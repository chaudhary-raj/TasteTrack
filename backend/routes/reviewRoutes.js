// routes/reviewRoutes.js
const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const verifyToken = require('../middleware/authMiddleware'); 

// Protected Route: Any logged-in user can submit a review
router.post('/submit', verifyToken, reviewController.submitReview);

// Protected Route: We need to add this new route and protect it with your verifyToken middleware, since we need to know exactly which user is asking for their review [cite: 296]
router.get('/my-review/:itemId', verifyToken, reviewController.getUserReview);

// Public Route: Anyone can view approved reviews for a food item
router.get('/item/:itemId', reviewController.getItemReviews);

module.exports = router;