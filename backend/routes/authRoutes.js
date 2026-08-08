// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyOtpController = require('../controllers/verifyOtpController');
const loginController = require('../controllers/loginController');

// Define the register POST route
router.post('/register', authController.register);
router.post('/verify-otp', verifyOtpController.verifyOTP);
router.post('/login', loginController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
module.exports = router;