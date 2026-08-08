const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config'); 
const startCronJobs = require('./utils/cronJobs'); // Background task for cleaning unverified users

// Route Imports
const authRoutes = require('./routes/authRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const foodItemRoutes = require('./routes/foodItemRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const searchRoutes = require('./routes/searchRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Allows us to parse JSON bodies from frontend requests

// Database Connection
mongoose.connect(config.mongoUri)
    .then(() => {
        console.log('MongoDB successfully connected!');
        
        // Start the background jobs once the DB is connected
        startCronJobs(); 
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err.message);
        process.exit(1); // Stop the server if the database fails to connect
    });

// Mount the API Routes
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/food-items', foodItemRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/results', searchRoutes);

// A simple test route
app.get('/', (req, res) => {
    res.send('Food Review API is running!');
});

// Start Server using the port from config.js
app.listen(config.port, () => {
    // Outputs a clickable link in the terminal
    console.log(`Server is running at http://localhost:${config.port}`);
});