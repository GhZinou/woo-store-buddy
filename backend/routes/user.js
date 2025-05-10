
const express = require('express');
const { authenticate } = require('../middlewares/auth');
const { getConnection } = require('../config/database');

const router = express.Router();

// Protect all routes in this router with authentication middleware
router.use(authenticate);

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    const connection = getConnection();
    const [users] = await connection.execute(
      'SELECT id, email, store_url FROM users WHERE id = ?',
      [req.userId]
    );
    
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const user = users[0];
    
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        storeUrl: user.store_url
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile'
    });
  }
});

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }
    
    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }
    
    // Update user in database
    const connection = getConnection();
    await connection.execute(
      'UPDATE users SET email = ? WHERE id = ?',
      [email, req.userId]
    );
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: req.userId,
        email
      }
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user profile'
    });
  }
});

module.exports = router;
