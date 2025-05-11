
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
    
    console.log(`Making ${method} request to WooCommerce API: ${url}`);
    
    // Make the request
    const response = await fetch(url, options);
    const responseText = await response.text();
    
    // Try to parse as JSON
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse API response as JSON:', responseText);
      throw new Error('Invalid response format from WooCommerce API');
    }
    
    // Check if the response is an error
    if (!response.ok) {
      console.error('WooCommerce API error:', result);
      throw new Error(result.message || `WooCommerce API error: ${response.status} ${response.statusText}`);
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
    if (!user.store_url || !user.ck || !user.cs) {
      console.error(`Missing store credentials for user ${userId}`);
      throw new Error('Store not properly linked. Missing credentials.');
    }
    
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
    if (!user.store_url || !user.ck || !user.cs) {
      console.error(`Missing store credentials for user ${userId}`);
      throw new Error('Store not properly linked. Missing credentials.');
    }
    
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
    if (!user.store_url || !user.ck || !user.cs) {
      console.error(`Missing store credentials for user ${userId}`);
      throw new Error('Store not properly linked. Missing credentials.');
    }
    
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
    if (!user.store_url || !user.ck || !user.cs) {
      console.error(`Missing store credentials for user ${userId}`);
      throw new Error('Store not properly linked. Missing credentials.');
    }
    
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
    if (!user.store_url || !user.ck || !user.cs) {
      console.error(`Missing store credentials for user ${userId}`);
      throw new Error('Store not properly linked. Missing credentials.');
    }
    
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

// Get order summary data for dashboard
async function getOrderSummary(userId, user) {
  try {
    if (!user.store_url || !user.ck || !user.cs) {
      console.error(`Missing store credentials for user ${userId}`);
      throw new Error('Store not properly linked. Missing credentials.');
    }
    
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfPrevMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    
    // Format dates for WooCommerce API
    const formatDate = (date) => date.toISOString();
    
    // Get current month orders
    const currentMonthOrders = await callWooCommerceAPI(
      user.store_url,
      decrypt(user.ck),
      decrypt(user.cs),
      `orders?after=${formatDate(startOfMonth)}`
    );
    
    // Get previous month orders
    const prevMonthOrders = await callWooCommerceAPI(
      user.store_url,
      decrypt(user.ck),
      decrypt(user.cs),
      `orders?after=${formatDate(startOfPrevMonth)}&before=${formatDate(startOfMonth)}`
    );
    
    // Get top products
    const products = await callWooCommerceAPI(
      user.store_url,
      decrypt(user.ck),
      decrypt(user.cs),
      'products?orderby=popularity&order=desc&per_page=5'
    );
    
    // Calculate totals for current month
    const currentMonthTotal = currentMonthOrders.reduce((sum, order) => {
      if (order.status !== 'cancelled' && order.status !== 'refunded') {
        return sum + parseFloat(order.total);
      }
      return sum;
    }, 0);
    
    // Calculate totals for previous month
    const prevMonthTotal = prevMonthOrders.reduce((sum, order) => {
      if (order.status !== 'cancelled' && order.status !== 'refunded') {
        return sum + parseFloat(order.total);
      }
      return sum;
    }, 0);
    
    // Calculate percent change
    const percentChange = prevMonthTotal > 0 
      ? ((currentMonthTotal - prevMonthTotal) / prevMonthTotal * 100).toFixed(1)
      : 100;
    
    // Get monthly sales data for chart
    const monthlySalesData = [];
    for (let i = 6; i >= 0; i--) {
      const monthStart = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthEnd = new Date(today.getFullYear(), today.getMonth() - i + 1, 0);
      
      const monthOrders = await callWooCommerceAPI(
        user.store_url,
        decrypt(user.ck),
        decrypt(user.cs),
        `orders?after=${formatDate(monthStart)}&before=${formatDate(monthEnd)}`
      );
      
      const monthTotal = monthOrders.reduce((sum, order) => {
        if (order.status !== 'cancelled' && order.status !== 'refunded') {
          return sum + parseFloat(order.total);
        }
        return sum;
      }, 0);
      
      const monthName = new Date(today.getFullYear(), today.getMonth() - i, 1)
        .toLocaleString('default', { month: 'short' });
      
      monthlySalesData.push({
        name: monthName,
        sales: monthTotal,
        orders: monthOrders.length
      });
    }
    
    // Get low stock products
    const lowStockProducts = await callWooCommerceAPI(
      user.store_url,
      decrypt(user.ck),
      decrypt(user.cs),
      'products?stock_status=instock&orderby=stock_quantity&order=asc&per_page=10'
    );
    
    const outOfStockCount = (await callWooCommerceAPI(
      user.store_url,
      decrypt(user.ck),
      decrypt(user.cs),
      'products?stock_status=outofstock&per_page=1'
    )).length;
    
    // Get recent orders
    const recentOrders = currentMonthOrders.slice(0, 5).map(order => ({
      id: order.id,
      number: order.number,
      customer: `${order.billing.first_name} ${order.billing.last_name}`,
      date: order.date_created,
      total: order.total,
      status: order.status
    }));
    
    // Get top selling products
    const topProducts = products.slice(0, 5).map(product => ({
      name: product.name,
      sold: product.total_sales || 0,
      revenue: ((product.price || 0) * (product.total_sales || 0)).toFixed(2)
    }));
    
    return {
      currentMonthTotal,
      percentChange,
      orderCount: currentMonthOrders.length,
      orderPercentChange: prevMonthOrders.length > 0 
        ? ((currentMonthOrders.length - prevMonthOrders.length) / prevMonthOrders.length * 100).toFixed(1)
        : 100,
      productCount: products.length,
      outOfStockCount,
      salesData: monthlySalesData,
      recentOrders,
      topProducts
    };
  } catch (error) {
    console.error(`Error fetching order summary for user ${userId}:`, error);
    throw error;
  }
}

module.exports = {
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getOrders,
  getOrderSummary
};
