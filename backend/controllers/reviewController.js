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
exports.getUserAllReview = async (req, res) => {
    try {
        const userId = req.user.userId; // Provided by your verifyToken middleware

        // 1. Use .find() for Mongoose
        // 2. Use .populate() to join the FoodItem data
        const reviews = await Review.find({ userId: userId })
            .populate({
                path: 'itemId',
                select: 'name restaurantId', // Get food name and the restaurant reference
                populate: {
                    path: 'restaurantId', // The field inside FoodItem that points to Restaurant
                    model: 'Restaurant',
                    select: 'name' // The field inside the Restaurant model you want to fetch
                }
            })
            .sort({ createdAt: -1 }); // Optional: sorts by newest first

        // Mongoose .find() returns an array. An empty array is still "truthy", 
        // so we check the length to see if they have no reviews.
        if (!reviews || reviews.length === 0) {
            return res.status(200).json({ 
                hasReviews: false, 
                message: "You haven't written any reviews yet.",
                reviews: [] 
            });
        }

        // Send back the array of populated reviews
        res.status(200).json({ 
            hasReviews: true, 
            reviews 
        });

    } catch (error) {
        console.error("Error fetching user's reviews:", error);
        res.status(500).json({ error: "Server error while fetching your reviews." });
    }
};

// 1. Get all unapproved reviews
// 1. Fetch reviews based on the tab (status)
exports.getReviewsByAdmin = async (req, res) => {
  try {
    const { status } = req.query; // Looks at the URL: ?status=pending
    // console.log(status);
    const reviews = await Review.find({ status: status || 'pending' })
      .populate('itemId', 'name')
      .populate('restaurantId', 'name')
      .populate('userId', 'name');
    res.status(200).json(reviews);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// 2. Approve -> Changes status to 'approved'
exports.approveReview = async (req, res) => {
  await Review.findByIdAndUpdate(req.params.id, { status: 'approved' });
  res.status(200).json({ message: 'Approved' });
};

// 3. Reject -> Changes status to 'rejected' (instead of deleting)
exports.rejectReview = async (req, res) => {
  await Review.findByIdAndUpdate(req.params.id, { status: 'rejected' });
  res.status(200).json({ message: 'Rejected' });
};

// 4. Delete -> Actually removes it from DB forever
exports.deleteReview = async (req, res) => {
  await Review.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: 'Deleted' });
};