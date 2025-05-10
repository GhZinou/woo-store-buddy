
const jwt = require('jsonwebtoken');
const { getConnection } = require('../config/database');

// Authentication middleware
async function authenticate(req, res, next) {
  try {
    // Get token from authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided'
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user exists in database
    const connection = getConnection();
    const [users] = await connection.execute(
      'SELECT id, email, store_url, ck, cs, expiration_date FROM users WHERE id = ?',
      [decoded.userId]
    );
    
    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    // Set user in request object
    req.user = users[0];
    req.userId = decoded.userId;
    
    // Continue to next middleware
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }
    
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
}

module.exports = {
  authenticate
};
