import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  googleLogin: (data) => api.post('/auth/google', data),
  getCurrentUser: () => api.get('/auth/me')
};

// Product APIs
export const productAPI = {
  getAll: () => api.get('/products'),
  getFeatured: () => api.get('/products/featured'),
  getNewArrivals: () => api.get('/products/new-arrivals'),
  getByCategory: (categoryId) => api.get(`/products/category/${categoryId}`),
  getBySlug: (slug) => api.get(`/products/slug/${slug}`),
  getById: (id) => api.get(`/products/${id}`),
  filter: (data, page = 0, size = 20) => api.post(`/products/filter?page=${page}&size=${size}`, data),
  search: (query) => api.get(`/products/search?query=${query}`),
  getBrands: () => api.get('/products/brands'),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`)
};

// Category APIs
export const categoryAPI = {
  getAll: () => api.get('/categories'),
  getParentCategories: () => api.get('/categories/parent'),
  getSubcategories: (parentId) => api.get(`/categories/${parentId}/subcategories`)
};

// Cart APIs
export const cartAPI = {
  getItems: (userId) => api.get(`/cart/user/${userId}`),
  addItem: (userId, data) => api.post(`/cart/user/${userId}/add`, data),
  updateItem: (userId, cartItemId, quantity) => api.put(`/cart/user/${userId}/item/${cartItemId}?quantity=${quantity}`),
  removeItem: (userId, cartItemId) => api.delete(`/cart/user/${userId}/item/${cartItemId}`),
  clear: (userId) => api.delete(`/cart/user/${userId}/clear`),
  getCount: (userId) => api.get(`/cart/user/${userId}/count`)
};

// Wishlist APIs
export const wishlistAPI = {
  getItems: (userId) => api.get(`/wishlist/user/${userId}`),
  addItem: (userId, productId) => api.post(`/wishlist/user/${userId}/add/${productId}`),
  removeItem: (userId, productId) => api.delete(`/wishlist/user/${userId}/remove/${productId}`),
  checkItem: (userId, productId) => api.get(`/wishlist/user/${userId}/check/${productId}`)
};

// Order APIs
export const orderAPI = {
  create: (userId, data) => api.post(`/orders/user/${userId}`, data),
  getUserOrders: (userId) => api.get(`/orders/user/${userId}`),
  getByNumber: (orderNumber) => api.get(`/orders/number/${orderNumber}`),
  getAll: () => api.get('/orders/admin/all'),
  updateStatus: (orderId, status) => api.put(`/orders/admin/${orderId}/status?status=${status}`),
  getStats: () => api.get('/orders/admin/stats')
};
