import api from './api';

export const orderService = {
  // Get all orders
  getOrders: async () => {
    try {
      const response = await api.get('/orders/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get order by ID
  getOrder: async (id) => {
    try {
      const response = await api.get(`/orders/${id}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create order
  createOrder: async (data) => {
    try {
      const response = await api.post('/orders/', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update order status (generic)
  updateOrderStatus: async (id, status) => {
    try {
      const response = await api.patch(`/orders/${id}/update_status/`, { status });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Confirm order (cook)
  confirmOrder: async (id) => {
    try {
      const response = await api.post(`/orders/${id}/confirm/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Mark order as ready (cook)
  markOrderReady: async (id) => {
    try {
      const response = await api.post(`/orders/${id}/mark_ready/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Complete order (cook)
  completeOrder: async (id) => {
    try {
      const response = await api.post(`/orders/${id}/complete/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Cancel order (customer)
  cancelOrder: async (id) => {
    try {
      const response = await api.post(`/orders/${id}/cancel/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get active orders
  getActiveOrders: async () => {
    try {
      const response = await api.get('/orders/active/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get completed orders
  getCompletedOrders: async () => {
    try {
      const response = await api.get('/orders/completed/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get order history
  getOrderHistory: async () => {
    try {
      const response = await api.get('/orders/history/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
