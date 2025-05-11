
const express = require('express');
const { authenticate } = require('../middlewares/auth');
const { getOrderSummary } = require('../utils/woocommerce');

const router = express.Router();

// Protect all routes in this router with authentication middleware
router.use(authenticate);

// Get dashboard summary data
router.get('/summary', async (req, res) => {
  try {
    // Call WooCommerce API to get dashboard summary
    const summary = await getOrderSummary(req.userId, req.user);
    
    res.json({
      success: true,
      summary
    });
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard summary'
    });
  }
});

module.exports = router;
