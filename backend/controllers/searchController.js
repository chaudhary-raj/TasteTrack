const FoodItem = require('../models/FoodItem');

// Escapes regex special characters so user input can't break $regex matching
// or be used to construct unintended patterns.
function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// GET: Main search with aggregation, averages, and sorting
exports.searchFood = async (req, res) => {
    try {
        const { q: query } = req.query;

        if (!query || query.trim() === "") {
            return res.status(400).json({
                error: "Please provide a search term."
            });
        }

        const trimmedQuery = query.trim();

        const searchResults = await FoodItem.aggregate([
            // Find matching food items
            {
                $match: {
                    name: {
                        $regex: escapeRegex(trimmedQuery),
                        $options: "i"
                    }
                }
            },
            // Join ONLY approved reviews, with the reviewer's display name attached
            // (respecting isAnonymous) — this is the moderation gate that was missing.
            {
                $lookup: {
                    from: "reviews",
                    let: { itemId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$itemId", "$$itemId"] },
                                status: "approved"
                            }
                        },
                        {
                            $lookup: {
                                from: "users",
                                localField: "userId",
                                foreignField: "_id",
                                as: "reviewer"
                            }
                        },
                        {
                            $unwind: { path: "$reviewer", preserveNullAndEmptyArrays: true }
                        },
                        {
                            $project: {
                                tasteRating: 1,
                                priceRating: 1,
                                cleanlinessRating: 1,
                                comment: 1,
                                createdAt: 1,
                                reviewerName: {
                                    $cond: [
                                        "$isAnonymous",
                                        "Anonymous",
                                        { $ifNull: ["$reviewer.name", "Unknown user"] }
                                    ]
                                }
                            }
                        },
                        { $sort: { createdAt: -1 } }
                    ],
                    as: "itemReviews"
                }
            },
            // Calculate average ratings from the approved reviews only
            {
                $addFields: {
                    avgTaste: { $ifNull: [{ $avg: "$itemReviews.tasteRating" }, 0] },
                    avgPrice: { $ifNull: [{ $avg: "$itemReviews.priceRating" }, 0] },
                    avgCleanliness: { $ifNull: [{ $avg: "$itemReviews.cleanlinessRating" }, 0] },
                    reviewCount: { $size: "$itemReviews" }
                }
            },
            {
                $addFields: {
                    overallRating: {
                        $avg: ["$avgTaste", "$avgPrice", "$avgCleanliness"]
                    }
                }
            },
            // Join restaurant details
            {
                $lookup: {
                    from: "restaurants",
                    localField: "restaurantId",
                    foreignField: "_id",
                    as: "restaurantDetails"
                }
            },
            {
                $unwind: { path: "$restaurantDetails", preserveNullAndEmptyArrays: true }
            },
            // Sort by overall rating
            {
                $sort: { overallRating: -1 }
            },
            // Shape the final response — includes the full approved review list now
            {
                $project: {
                    name: 1,
                    description: 1,
                    price: 1,
                    restaurantId: 1,
                    "restaurantDetails._id": 1,
                    "restaurantDetails.name": 1,
                    "restaurantDetails.address": 1,
                    avgTaste: 1,
                    avgPrice: 1,
                    avgCleanliness: 1,
                    overallRating: 1,
                    reviewCount: 1,
                    reviews: "$itemReviews"
                }
            }
        ]);

        return res.status(200).json(searchResults);

    } catch (error) {
        console.error("Search Error:", error);
        return res.status(500).json({
            error: "Server error while searching."
        });
    }
};

// GET: Suggestions for autocomplete
exports.getSuggestions = async (req, res) => {
    try {
        const { q: query } = req.query;

        if (!query || query.trim() === "") {
            return res.status(200).json([]);
        }

        const matches = await FoodItem.find({
            name: {
                $regex: escapeRegex(query.trim()),
                $options: "i"
            }
        })
            .select("name -_id")
            .limit(5);

        const uniqueSuggestions = [...new Set(matches.map(item => item.name))];

        return res.status(200).json(uniqueSuggestions);

    } catch (error) {
        console.error("Suggestion Error:", error);

        return res.status(500).json({
            error: "Server error fetching suggestions."
        });
    }
};