const FoodItem = require('../models/FoodItem');

// GET: Main search with aggregation, averages, and sorting
exports.searchFood = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ error: "Please provide a search term." });
        }

        // The MongoDB Aggregation Pipeline
        const searchResults = await FoodItem.aggregate([
            // Step 1: Find food items that match the search query (case-insensitive)
            { 
                $match: { name: { $regex: query, $options: 'i' } } 
            },
            
            // Step 2: Join the Reviews for these specific items
            {
                $lookup: {
                    from: 'reviews', 
                    localField: '_id',
                    foreignField: 'itemId',
                    as: 'itemReviews'
                }
            },

            // Step 3: Calculate the averages for Taste, Price, and Cleanliness
            {
                $addFields: {
                    avgTaste: { $avg: "$itemReviews.tasteRating" },
                    avgPrice: { $avg: "$itemReviews.priceRating" },
                    avgCleanliness: { $avg: "$itemReviews.cleanlinessRating" }
                }
            },

            // Step 4: Calculate the Overall Rating and Review Count
            {
                $addFields: {
                    overallRating: { 
                        $avg: ["$avgTaste", "$avgPrice", "$avgCleanliness"] 
                    },
                    reviewCount: { $size: "$itemReviews" }
                }
            },

            // Step 5: Join the Restaurant details so the frontend has everything it needs
            {
                $lookup: {
                    from: 'restaurants',
                    localField: 'restaurantId',
                    foreignField: '_id',
                    as: 'restaurantDetails'
                }
            },
            
            // Unwind the restaurant array so it's a single object instead of an array of one
            { $unwind: "$restaurantDetails" },

            // Step 6: Sort the final list by overallRating in descending order (-1)
            { $sort: { overallRating: -1 } },

            // Step 7: Clean up the data sent to the frontend (hide the raw reviews array)
            {
                $project: {
                    itemReviews: 0 
                }
            }
        ]);

        res.status(200).json(searchResults);

    } catch (error) {
        console.error("Search Error:", error);
        res.status(500).json({ error: "Server error while searching." });
    }
};

// GET: Lightweight search for 500ms auto-suggestions
exports.getSuggestions = async (req, res) => {
    try {
        const { query } = req.query;

        // If the user clears the search bar, return an empty array
        if (!query) {
            return res.status(200).json([]);
        }

        // Lightweight search: Find items matching the query, but ONLY return the 'name' field[cite: 323].
        // Limit the results to 5 so it is lightning fast[cite: 323].
        const matches = await FoodItem.find({ 
            name: { $regex: query, $options: 'i' } 
        })
        .select('name')
        .limit(5);

        // Filter out duplicate names (e.g., if 3 restaurants have "Pizza", just suggest "Pizza" once)
        const uniqueSuggestions = [...new Set(matches.map(item => item.name))];

        res.status(200).json(uniqueSuggestions);

    } catch (error) {
        console.error("Suggestion Error:", error);
        res.status(500).json({ error: "Server error fetching suggestions." });
    }
};