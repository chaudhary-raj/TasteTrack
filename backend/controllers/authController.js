// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const config = require('../config');

// 1. Import the generator function from your utility
const { generateOtp } = require('../utils/otpGenerator');

// Set up Nodemailer transporter using your .env credentials
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,             // Switch from 465 to 587
  secure: false,        // Set to false for port 587 (uses STARTTLS)
  auth: {
    user: config.emailUser,
    pass: config.emailPass, // Must be a 16-character Google App Password
  },
  family: 4,             // Force IPv4 to bypass Render's IPv6 connection block
});

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Check domain
        if (!email.endsWith('@nitkkr.ac.in')) {
            return res.status(403).json({ error: "Only @nitkkr.ac.in emails are allowed." });
        }

        // 2. Generate standard data for the new attempt using the utility
        const { otp, otpExpires } = generateOtp(); 
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // 3. Check if user already exists
        let user = await User.findOne({ email });

        if (user) {
            // If they exist AND are verified, reject them
            if (user.isVerified) {
                return res.status(400).json({ error: "Email already registered. Please log in." });
            }
            
            // If they exist but are NOT verified, update their existing record
            user.name = name;
            user.passwordHash = passwordHash;
            user.otp = otp;
            user.otpExpires = otpExpires;
            await user.save();
            
        } else {
            // If they don't exist at all, create a completely new user
            user = new User({
                name,
                email,
                passwordHash,
                otp,
                otpExpires
            });
            await user.save();
        }

        // 4. Send the OTP via Email
        const mailOptions = {
            from: config.emailUser,
            to: email,
            subject: 'Your Food Review App OTP',
            text: `Hello ${name}, your OTP for registration is: ${otp}. It will expire in 10 minutes.`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "Registration successful. Please check your email for the new OTP." });

    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ error: "Server error during registration." });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: "Email is required." });
        }

        const user = await User.findOne({ email });

        // Same response whether or not the account exists — avoids leaking which roll numbers are registered
        if (!user) {
            return res.status(200).json({ message: "If that account exists, a reset code has been sent." });
        }

        // Generate OTP using the utility here as well
        const { otp, otpExpires } = generateOtp();

        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        const mailOptions = {
            from: config.emailUser,
            to: email,
            subject: 'Your Food Review App Password Reset Code',
            text: `Hello ${user.name}, your password reset code is: ${otp}. It will expire in 10 minutes. If you didn't request this, you can ignore this email.`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "If that account exists, a reset code has been sent." });

    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({ error: "Server error. Please try again." });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({ error: "Email, code, and new password are all required." });
        }
        if (newPassword.length < 8) {
            return res.status(400).json({ error: "Password must be at least 8 characters." });
        }

        const user = await User.findOne({ email });

        const isValid =
            user &&
            user.otp === otp &&
            user.otpExpires &&
            user.otpExpires > new Date();

        if (!isValid) {
            return res.status(400).json({ error: "Invalid or expired code. Please request a new one." });
        }

        const salt = await bcrypt.genSalt(10);
        user.passwordHash = await bcrypt.hash(newPassword, salt);
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.status(200).json({ message: "Password updated successfully." });

    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(500).json({ error: "Server error. Please try again." });
    }
};