// routes/restaurantRoutes.js
const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const verifyToken = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/adminMiddleware'); // 1. Import the new admin bouncer

// Protected Route: Must be logged in AND be an admin
router.post('/', verifyToken, isAdmin, restaurantController.addRestaurant);

// Public Route: Anyone can view the list of restaurants
router.get('/', restaurantController.getAllRestaurants);

module.exports = router;