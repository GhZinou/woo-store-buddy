
import axios from 'axios';
import { toast } from 'sonner';

// Create axios instance with base URL and default headers
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add authorization token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('woostore_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle error responses
    const { response } = error;
    
    if (response && response.status === 401) {
      // Unauthorized, clear token and redirect to login
      localStorage.removeItem('woostore_token');
      localStorage.removeItem('woostore_user');
      
      // Only show toast if not already on login page
      if (window.location.pathname !== '/login') {
        toast.error('Your session has expired. Please login again.');
        window.location.href = '/login';
      }
    } else if (response && response.data && response.data.message) {
      // Show error message from API response
      toast.error(response.data.message);
    } else {
      // Show generic error message
      toast.error('An error occurred. Please try again later.');
    }
    
    return Promise.reject(error);
  }
);

// Export default api instance
export default api;

// Auth service
export const authService = {
  register: async (email: string, password: string, name: string) => {
    const response = await api.post('/auth/register', { email, password, name });
    return response.data;
  },
  
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  connectStore: async (userId: string, storeUrl: string, consumerKey: string, consumerSecret: string) => {
    const response = await api.post('/auth/connect-store', { userId, storeUrl, consumerKey, consumerSecret });
    return response.data;
  }
};

// Products service
export const productsService = {
  getProducts: async () => {
    const response = await api.get('/products');
    return response.data;
  },
  
  getProduct: async (id: string) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
  
  updateProduct: async (id: string, data: any) => {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },
  
  deleteProduct: async (id: string) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  }
};

// Orders service
export const ordersService = {
  getOrders: async (params: any = {}) => {
    const response = await api.get('/orders', { params });
    return response.data;
  },
  
  getOrder: async (id: string) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  }
};

// User service
export const userService = {
  getProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },
  
  updateProfile: async (data: any) => {
    const response = await api.put('/user/profile', data);
    return response.data;
  }
};

// Dashboard service
export const dashboardService = {
  getSummary: async () => {
    const response = await api.get('/dashboard/summary');
    return response.data;
  }
};
