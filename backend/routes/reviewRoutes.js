// routes/reviewRoutes.js
const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const verifyToken = require('../middleware/authMiddleware'); 

// Protected Route: Any logged-in user can submit a review
router.post('/', verifyToken, reviewController.submitReview);

// Protected Route: We need to add this new route and protect it with your verifyToken middleware, since we need to know exactly which user is asking for their review [cite: 296]
router.get('/my-review/:itemId', verifyToken, reviewController.getUserReview);
router.get('/',verifyToken,reviewController.getUserAllReview);
// Public Route: Anyone can view approved reviews for a food item
router.get('/item/:itemId', reviewController.getItemReviews);

const isAdmin = require('../middleware/adminMiddleware'); // Import your admin bouncer

// Secure route: Only admins can see the pending queue
router.get('/admin/queue', verifyToken, isAdmin, reviewController.getReviewsByAdmin);
router.put('/:id/approve', verifyToken, isAdmin, reviewController.approveReview);
router.put('/:id/reject', verifyToken, isAdmin, reviewController.rejectReview); // Changed to PUT
router.delete('/:id', verifyToken, isAdmin, reviewController.deleteReview); // New Delete Route
// ... your other review routes (like POST / or GET /my-review/:itemId) go below this
module.exports = router;