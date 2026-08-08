const express = require('express');
const router = express.Router();
const foodItemController = require('../controllers/foodItemController');
const verifyToken = require('../middleware/authMiddleware'); // Protect the add route
const isAdmin = require('../middleware/adminMiddleware');
// Protected Route: Only logged-in admins get past 'verifyToken' and the controller check
router.post('/', verifyToken, isAdmin, foodItemController.addFoodItem);

// Public Route: Anyone can view the food menu for a restaurant
// Note the :restaurantId dynamic parameter in the URL
router.get('/:restaurantId', foodItemController.getFoodItemsByRestaurant);

module.exports = router;