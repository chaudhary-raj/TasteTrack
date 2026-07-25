const Review = require('../models/Review');
// POST: Submit or Edit a Review (Logged-in Users)
exports.submitReview = async (req, res) => {
    try {
        const { itemId, tasteRating, priceRating, cleanlinessRating, comment, isAnonymous } = req.body;
        
        // Grab the userId from the decoded JWT token (injected by your middleware)
        const userId = req.user.userId; 

        if (!itemId || !tasteRating || !priceRating || !cleanlinessRating) {
            return res.status(400).json({ error: "Item ID and all three ratings are required." });
        }

        // The Upsert Magic: Search for an existing review by this user for this item [cite: 279]
        const review = await Review.findOneAndUpdate(
            { itemId: itemId, userId: userId }, 
            { 
                tasteRating, 
                priceRating, 
                cleanlinessRating, 
                comment, 
                isAnonymous,
                isApproved: false // Always resets to false so admins can moderate edited reviews
            },
            { 
                new: true,                // Return the newly updated document
                upsert: true,             // If no match is found, create a new one!
                setDefaultsOnInsert: true // Ensure timestamps and defaults are applied
            }
        );

        res.status(200).json({ message: "Review saved successfully!", review });

    } catch (error) {
        console.error("Error submitting review:", error);
        res.status(500).json({ error: "Server error while submitting review." });
    }
};

// GET: Fetch a logged-in user's specific review for an item
exports.getUserReview = async (req, res) => {
    try {
        const { itemId } = req.params;
        const userId = req.user.userId; // Provided by your verifyToken middleware

        // Look for a review that matches both the itemId from the URL and the userId from the user's JWT token [cite: 295]
        const review = await Review.findOne({ itemId: itemId, userId: userId });

        // If no review exists, let the frontend know they are starting fresh [cite: 298]
        if (!review) {
            return res.status(200).json({ hasReview: false });
        }

        // If it exists, send the review data back to pre-fill the form [cite: 299]
        res.status(200).json({ hasReview: true, review });

    } catch (error) {
        console.error("Error fetching user's review:", error);
        res.status(500).json({ error: "Server error while fetching your review." });
    }
};

// GET: Fetch all approved reviews for a specific Food Item (Public)
exports.getItemReviews = async (req, res) => {
    try {
        const { itemId } = req.params;

        // Only fetch reviews where isApproved is true
        // Populate the 'userId' field to get the reviewer's name, but ONLY return the name
        const reviews = await Review.find({ itemId, isApproved: true })
                                    .populate('userId', 'name');
        
        res.status(200).json(reviews);
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ error: "Server error while fetching reviews." });
    }
};