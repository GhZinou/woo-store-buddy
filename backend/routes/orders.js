
const express = require('express');
const { authenticate } = require('../middlewares/auth');
const { getOrders } = require('../utils/woocommerce');

const router = express.Router();

// Protect all routes in this router with authentication middleware
router.use(authenticate);

// Get all orders with optional filtering
router.get('/', async (req, res) => {
  try {
    // Extract query parameters for filtering
    const { status, customer, date_created_min, date_created_max, page, per_page } = req.query;
    
    // Build query params object
    const queryParams = {};
    
    if (status) queryParams.status = status;
    if (customer) queryParams.customer = customer;
    if (date_created_min) queryParams.date_created_min = date_created_min;
    if (date_created_max) queryParams.date_created_max = date_created_max;
    if (page) queryParams.page = page;
    if (per_page) queryParams.per_page = per_page;
    
    // Call WooCommerce API to get orders
    const orders = await getOrders(req.userId, req.user, queryParams);
    
    res.json({
      success: true,
      orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
});

// Get single order
router.get('/:id', async (req, res) => {
  try {
    const orderId = req.params.id;
    
    // Call WooCommerce API to get a specific order
    const orders = await getOrders(req.userId, req.user, { include: orderId });
    
    if (!orders || orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    res.json({
      success: true,
      order: orders[0]
    });
  } catch (error) {
    console.error(`Error fetching order ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order'
    });
  }
});

module.exports = router;
