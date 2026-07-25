const FoodItem = require('../models/FoodItem');

// POST: Add a new food item (Admin only)
exports.addFoodItem = async (req, res) => {
    try {
        // 1. Check if the user making the request is an admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: "Access denied. Only admins can add food items." });
        }

        const { restaurantId, name, description, price } = req.body;

        // 2. Validate that the required fields are present
        if (!restaurantId || !name || !price) {
            return res.status(400).json({ error: "Restaurant ID, name, and price are required." });
        }

        // 3. Create and save the new food item
        const newFoodItem = new FoodItem({
            restaurantId,
            name,
            description,
            price
        });

        await newFoodItem.save();
        res.status(201).json({ message: "Food item added successfully!", foodItem: newFoodItem });

    } catch (error) {
        console.error("Error adding food item:", error);
        res.status(500).json({ error: "Server error while adding food item." });
    }
};

// GET: Fetch all food items for a specific restaurant (Public)
exports.getFoodItemsByRestaurant = async (req, res) => {
    try {
        // Extract the restaurantId from the URL parameters
        const { restaurantId } = req.params;
        
        // Find all food items linked to this specific restaurant
        const foodItems = await FoodItem.find({ restaurantId });
        
        res.status(200).json(foodItems);
    } catch (error) {
        console.error("Error fetching food items:", error);
        res.status(500).json({ error: "Server error while fetching food items." });
    }
};