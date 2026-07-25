// routes/restaurantRoutes.js
const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const verifyToken = require('../middleware/authMiddleware'); // Import your middleware!

// Protected Route: Only logged-in users with valid tokens get past 'verifyToken'
router.post('/add', verifyToken, restaurantController.addRestaurant);

// Public Route: Anyone can view the list of restaurants
router.get('/', restaurantController.getAllRestaurants);

module.exports = router;