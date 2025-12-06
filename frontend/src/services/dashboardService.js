import api from './api';

export const dashboardService = {
  /**
   * Get cook dashboard statistics
   */
  getCookStats: async () => {
    const response = await api.get('/dashboard/cook/stats/');
    return response.data;
  },

  /**
   * Get today's orders for cook, grouped by status
   */
  getCookTodaysOrders: async () => {
    const response = await api.get('/dashboard/cook/todays-orders/');
    return response.data;
  },

  /**
   * Get customer dashboard statistics
   */
  getCustomerStats: async () => {
    const response = await api.get('/dashboard/customer/stats/');
    return response.data;
  },
};
