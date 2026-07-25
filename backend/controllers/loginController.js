const User = require('../models/User');
const bcrypt = require('bcrypt');
const config = require('../config');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password." });
        }

        // 2. Check if the user is verified
        if (!user.isVerified) {
            return res.status(403).json({ error: "Please verify your email with the OTP before logging in." });
        }

        // 3. Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid email or password." });
        }

        // 4. Generate the JWT token for login
        const token = jwt.sign(
            { userId: user._id, role: user.role }, 
            config.jwtSecret, 
            { expiresIn: '7d' }
        );

        res.status(200).json({ message: "Login successful!", token });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: "Server error during login." });
    }
};