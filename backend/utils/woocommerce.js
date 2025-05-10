
const fetch = require('node-fetch');
const { decrypt } = require('./encryption');

// Function to call WooCommerce API
async function callWooCommerceAPI(storeUrl, consumerKey, consumerSecret, endpoint, method = 'GET', data = null) {
  try {
    // Normalize store URL (remove trailing slash if present)
    const baseUrl = storeUrl.endsWith('/') ? storeUrl.slice(0, -1) : storeUrl;
    
    // Build the complete URL
    const url = `${baseUrl}/wp-json/wc/v3/${endpoint}`;
    
    // Create authentication header using consumer key and secret
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
    
    // Configure the request
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`
      }
    };
    
    // Add body for POST, PUT requests
    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }
    
    // Make the request
    const response = await fetch(url, options);
    
    // Parse the response
    const result = await response.json();
    
    // Check if the response is an error
    if (!response.ok) {
      throw new Error(result.message || 'WooCommerce API error');
    }
    
    return result;
  } catch (error) {
    console.error('WooCommerce API call failed:', error);
    throw error;
  }
}

// Get products from WooCommerce
async function getProducts(userId, user) {
  try {
    return await callWooCommerceAPI(
      user.store_url,
      decrypt(user.ck),
      decrypt(user.cs),
      'products'
    );
  } catch (error) {
    console.error(`Error fetching products for user ${userId}:`, error);
    throw error;
  }
}

// Get single product from WooCommerce
async function getProduct(userId, user, productId) {
  try {
    return await callWooCommerceAPI(
      user.store_url,
      decrypt(user.ck),
      decrypt(user.cs),
      `products/${productId}`
    );
  } catch (error) {
    console.error(`Error fetching product ${productId} for user ${userId}:`, error);
    throw error;
  }
}

// Update product in WooCommerce
async function updateProduct(userId, user, productId, data) {
  try {
    return await callWooCommerceAPI(
      user.store_url,
      decrypt(user.ck),
      decrypt(user.cs),
      `products/${productId}`,
      'PUT',
      data
    );
  } catch (error) {
    console.error(`Error updating product ${productId} for user ${userId}:`, error);
    throw error;
  }
}

// Delete product in WooCommerce
async function deleteProduct(userId, user, productId) {
  try {
    return await callWooCommerceAPI(
      user.store_url,
      decrypt(user.ck),
      decrypt(user.cs),
      `products/${productId}`,
      'DELETE'
    );
  } catch (error) {
    console.error(`Error deleting product ${productId} for user ${userId}:`, error);
    throw error;
  }
}

// Get orders from WooCommerce
async function getOrders(userId, user, queryParams = {}) {
  try {
    // Build query string from params
    const queryString = Object.entries(queryParams)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');
    
    const endpoint = queryString ? `orders?${queryString}` : 'orders';
    
    return await callWooCommerceAPI(
      user.store_url,
      decrypt(user.ck),
      decrypt(user.cs),
      endpoint
    );
  } catch (error) {
    console.error(`Error fetching orders for user ${userId}:`, error);
    throw error;
  }
}

module.exports = {
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getOrders
};
