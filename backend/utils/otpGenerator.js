const otp = Math.floor(100000 + Math.random() * 900000).toString();
const otpExpires = new Date(Date.now() + 10 * 60000);
module.exports = {
    otp,
    otpExpires
};