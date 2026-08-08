// utils/otpGenerator.js

exports.generateOtp = () => {
    // Generates a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Sets expiration to 10 minutes from exactly right now
    const otpExpires = new Date(Date.now() + 10 * 60000);
    
    return {
        otp,
        otpExpires
    };
};