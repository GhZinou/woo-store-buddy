
const express = require('express');
const { authenticate } = require('../middlewares/auth');
const { getProducts, getProduct, updateProduct, deleteProduct } = require('../utils/woocommerce');

const router = express.Router();

// Protect all routes in this router with authentication middleware
router.use(authenticate);

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await getProducts(req.userId, req.user);
    res.json({
      success: true,
      products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products'
    });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await getProduct(req.userId, req.user, productId);
    res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error(`Error fetching product ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product'
    });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const productData = req.body;
    
    const updatedProduct = await updateProduct(req.userId, req.user, productId, productData);
    
    res.json({
      success: true,
      product: updatedProduct,
      message: 'Product updated successfully'
    });
  } catch (error) {
    console.error(`Error updating product ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product'
    });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    
    const result = await deleteProduct(req.userId, req.user, productId);
    
    res.json({
      success: true,
      result,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error(`Error deleting product ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product'
    });
  }
});

module.exports = router;
