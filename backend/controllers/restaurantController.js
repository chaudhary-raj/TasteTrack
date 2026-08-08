const Restaurant = require('../models/Restaurant');

// POST: Add a new restaurant (Admin only)
exports.addRestaurant = async (req, res) => {
    try {
        // 1. Check if the user making the request is an admin
        // (req.user comes from your verifyToken middleware!)
        // console.log(req.user);
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: "Access denied. Only admins can add restaurants." });
        }

        const { name, address, contactInfo, imageUrl } = req.body;
        
        // 2. Create and save the new restaurant
        const newRestaurant = new Restaurant({
            name,
            address,
            contactInfo,
            imageUrl
        });

        await newRestaurant.save();
        res.status(201).json({ message: "Restaurant added successfully!", restaurant: newRestaurant });

    } catch (error) {
        console.error("Error adding restaurant:", error);
        res.status(500).json({ error: "Server error while adding restaurant." });
    }
};

// GET: Fetch all restaurants (Public)
exports.getAllRestaurants = async (req, res) => {
    try {
        // Find all restaurants in the database
        const restaurants = await Restaurant.find();
        res.status(200).json(restaurants);
    } catch (error) {
        console.error("Error fetching restaurants:", error);
        res.status(500).json({ error: "Server error while fetching restaurants." });
    }
};