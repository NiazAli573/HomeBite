import api from './api';

export const ratingService = {
  /**
   * Submit a rating for a completed order
   */
  createRating: async (ratingData) => {
    const response = await api.post('/ratings/', ratingData);
    return response.data;
  },

  /**
   * Get ratings given by current customer
   */
  getMyRatings: async () => {
    const response = await api.get('/ratings/my_ratings/');
    return response.data;
  },

  /**
   * Get ratings received by current cook
   */
  getReceivedRatings: async () => {
    const response = await api.get('/ratings/received/');
    return response.data;
  },

  /**
   * Get all ratings
   */
  getAllRatings: async () => {
    const response = await api.get('/ratings/');
    return response.data;
  },
};
