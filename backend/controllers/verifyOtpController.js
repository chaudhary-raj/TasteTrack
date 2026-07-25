const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config');

exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // 1. Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        // 2. Check if they are already verified
        if (user.isVerified) {
            return res.status(400).json({ error: "Account is already verified. Please log in." });
        }

        // 3. Verify the OTP and check expiration
        if (user.otp !== otp) {
            return res.status(400).json({ error: "Invalid OTP." });
        }
        if (user.otpExpires < new Date()) {
            return res.status(400).json({ error: "OTP has expired. Please request a new one." });
        }

        // 4. Update the user record
        user.isVerified = true;
        user.otp = undefined; // Clear the OTP
        user.otpExpires = undefined; // Clear the expiration
        await user.save();

        // 5. Generate the JWT token for login
        const token = jwt.sign(
            { userId: user._id, role: user.role }, 
            config.jwtSecret, 
            { expiresIn: '7d' } // Token lasts for 7 days
        );

        res.status(200).json({ message: "Verification successful!", token });

    } catch (error) {
        console.error("Verification Error:", error);
        res.status(500).json({ error: "Server error during verification." });
    }
};