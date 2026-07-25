require("dotenv").config();
const config = {
    port : process.env.PORT,
    jwtSecret: process.env.JWT_SECRET,
    mongoUrl: process.env.MONGO_URL,
    emailUser: process.env.EMAIL_USER,
    emailPass: process.env.EMAIL_PASS
};
module.exports = config;