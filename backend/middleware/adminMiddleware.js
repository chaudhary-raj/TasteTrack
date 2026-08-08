// middleware/adminMiddleware.js
const User = require('../models/User');

const isAdmin = async (req, res, next) => {
  try {
    // req.user is provided by your verifyToken middleware
    // Note: Use req.user.userId or req.user.id depending on how you named it in your JWT payload!
    const Role = req.user.role;
    
    if (!Role) {
      return res.status(404).json({ message: "User not found." });
    }

    if (Role !== 'admin') {
      return res.status(403).json({ message: "Access denied. Admin privileges required." });
    }

    // If they are an admin, allow them to proceed to the controller
    next(); 
  } catch (error) {
    console.error("Admin verification error:", error);
    res.status(500).json({ message: "Access Denied, You are not admin" });
  }
};

module.exports = isAdmin;