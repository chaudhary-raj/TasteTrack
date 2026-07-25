const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    itemId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'FoodItem', 
        required: true 
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    tasteRating: { type: Number, required: true, min: 1, max: 5 },
    priceRating: { type: Number, required: true, min: 1, max: 5 },
    cleanlinessRating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    isAnonymous: { type: Boolean, default: false },
    isApproved: { 
        type: Boolean, 
        default: false // Admins will need to switch this to true for it to display
    }
}, { timestamps: true });

// THIS IS THE MAGIC CONSTRAINT:
// It ensures that any combination of itemId and userId must be entirely unique.
reviewSchema.index({ itemId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);