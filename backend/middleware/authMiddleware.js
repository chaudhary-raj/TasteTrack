const jwt = require('jsonwebtoken');
const config = require('../config');

const verifyToken = (req, res, next) => {
    try {
        // 1. Grab the token from the request headers
        // Standard format is "Bearer <token>"
        const authHeader = req.header('Authorization');
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: "Access denied. No token provided." });
        }

        // 2. Extract just the token string
        const token = authHeader.split(' ')[1];

        // 3. Verify the token using your secret key
        const decoded = jwt.verify(token, config.jwtSecret);

        // 4. Attach the decoded payload (userId and role) to the request object
        req.user = decoded;
        
        // 5. Pass control to the next function (the actual route controller)
        next();

    } catch (error) {
        // If the token is invalid or expired, jwt.verify throws an error
        return res.status(401).json({ error: "Invalid or expired token." });
    }
};

module.exports = verifyToken;