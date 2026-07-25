// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const config = require('../config');
const {otp, otpExpires} = require('../utils/otpGenerator');
// Set up Nodemailer transporter using your .env credentials
const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: config.emailUser,
        pass: config.emailPass
    }
});

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Check domain
        if (!email.endsWith('@nitkkr.ac.in')) {
            return res.status(403).json({ error: "Only @nitkkr.ac.in emails are allowed." });
        }

        // Generate standard data for the new attempt
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60000); 
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // 2. Check if user already exists
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

        // 3. Send the OTP via Email
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