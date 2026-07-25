const express = require('express');
const router = express.Router();
const foodItemController = require('../controllers/foodItemController');
const verifyToken = require('../middleware/authMiddleware'); // Protect the add route

// Protected Route: Only logged-in admins get past 'verifyToken' and the controller check
router.post('/add', verifyToken, foodItemController.addFoodItem);

// Public Route: Anyone can view the food menu for a restaurant
// Note the :restaurantId dynamic parameter in the URL
router.get('/restaurant/:restaurantId', foodItemController.getFoodItemsByRestaurant);

module.exports = router;