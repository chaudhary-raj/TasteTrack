const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

// Public Route: Lightweight route for auto-suggestions
// GET /api/search/suggestions?query=foodName
router.get('/suggestions', searchController.getSuggestions);

// Public Route: The heavy aggregation route for the final search results
// GET /api/search?query=foodName
router.get('/', searchController.searchFood);

module.exports = router;